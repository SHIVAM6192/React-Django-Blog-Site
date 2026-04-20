from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.utils.dateparse import parse_date
from rest_framework.pagination import PageNumberPagination
from .models import Post, Profile, Comment, Category
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import PostSerializer, RegisterSerializer, ProfileSerializer, CommentSerializer, CategorySerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    """
    Retrieves all active and visible posts for the main feed.
    Supports filtering by text search (title/author) and exact date lookup.
    Results are returned inside a paginated JSON response (6 items per page).
    """
    search_query = request.GET.get('search', '')
    date_query = request.GET.get('date', '')
    
    posts = Post.objects.filter(is_active=True, is_show=True)

    if search_query:
        posts = posts.filter(
            Q(title__icontains=search_query) |
            Q(author__username__icontains=search_query)
        )
        
    if date_query:
        parsed_date = parse_date(date_query)
        if parsed_date:
            posts = posts.filter(created_at__date=parsed_date)

    posts = posts.order_by('-created_at')
    
    paginator = PageNumberPagination()
    paginator.page_size = 6
    result_page = paginator.paginate_queryset(posts, request)
    
    serializer = PostSerializer(result_page, many=True, context={'request': request}) 
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_posts(request):
    """
    Retrieves all posts created by the currently authenticated user.
    Results are returned inside a paginated JSON structure.
    Used exclusively in the 'My Posts' management dashboard.
    """
    posts = Post.objects.filter(author=request.user).order_by('-created_at')
    paginator = PageNumberPagination()
    paginator.page_size = 6
    result_page = paginator.paginate_queryset(posts, request)
    
    serializer = PostSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, pk):
    """
    Allows the authenticated user to update details of an existing post.
    Validates ownership to prevent users from modifying someone else's content.
    Expects partial payload data (title, content, image, etc.).
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Security Check: Ensure the user owns this post
    if post.author != request.user:
        return Response({"error": "You cannot edit someone else's post"}, status=status.HTTP_403_FORBIDDEN)

    serializer = PostSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    """
    Creates a new blog post attributed to the authenticated user.
    Context is manually passed to the serializer to properly validate 
    likes and ownership fields during creation.
    """
    data = request.data
    # FIX: Added context={'request': request}
    # Without this, 'get_is_liked' in serializer will fail and cause a 500 error
    serializer = PostSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Handles user logout by explicitly blacklisting the user's current refresh token,
    terminating their local session on the backend natively and securely.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try: 
            refresh_token = request.data["refresh_token"]
            token  = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(status=status.HTTP_205_RESET_CONTENT)
        
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Fetches the profile details of the currently authenticated user.
    Used to inject initial login state payload on the frontend app load.
    """
    user = request.user
    # Improvement: Using ProfileSerializer ensures consistent data (images, bio, etc.)
    # If you prefer the simple version, you can keep the dictionary method.
    serializer = ProfileSerializer(user.profile, context={'request': request})
    return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    """
    Handles new user registration logic via a generic CreateAPIView.
    Allows unrestricted, unauthenticated access so external visitors can sign up freely.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    """
    Deletes an existing post permanently.
    Verifies that the requester is the original author before safely destroying the document.
    """
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Security Check: User can only delete THEIR OWN post
    if post.author != request.user:
        return Response(
            {"error": "You are not authorized to delete this post."}, 
            status=status.HTTP_403_FORBIDDEN
        )

    post.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_categories(request):
    """
    Fetches a simple list of all available post categories within the database.
    Used to populate dropdowns in the creation and filtering UIs natively.
    """
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, post_id):
    """
    Appends a new user comment to a specific post.
    Automatically captures and ties the currently logged-in user to the new comment instance.
    """
    post = get_object_or_404(Post, pk=post_id)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    """
    Toggles the like status of a specific post.
    If the user has already liked it, calling this unlikes it, and vice versa.
    Dynamically returns the newly updated string/status data.
    """
    post = get_object_or_404(Post, pk=post_id)
    if post.likes.filter(id=request.user.id).exists():
        post.likes.remove(request.user)
        return Response({'status': 'unliked', 'likes_count': post.likes.count()})
    else:
        post.likes.add(request.user)
        return Response({'status': 'liked', 'likes_count': post.likes.count()})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request, username):
    """
    Fetches a specific user's public profile data based on their precise username.
    Also retrieves a mapped, paginated payload array of their published and active posts.
    """
    user = get_object_or_404(User, username=username)
    serializer = ProfileSerializer(user.profile, context={'request': request})
    
    # Get user's posts
    posts = Post.objects.filter(author=user, is_active=True, is_show=True).order_by('-created_at')
    
    paginator = PageNumberPagination()
    paginator.page_size = 6
    result_page = paginator.paginate_queryset(posts, request)
    post_serializer = PostSerializer(result_page, many=True, context={'request': request})
    
    return Response({
        'profile': serializer.data,
        'posts': {
            'count': paginator.page.paginator.count,
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
            'results': post_serializer.data
        }
    })
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Updates the authenticated user's core attributes natively (First Name, Last Name, Email)
    as well as dynamically extended Profile traits (Bio, Avatars, Covers).
    Accepts partial JSON payloads effectively via DRF nested serializers.
    """
    user = request.user
    profile = user.profile
    data = request.data

    # 1. Manually Update User Model Fields (Name, Email)
    user_changed = False
    if 'first_name' in data:
        user.first_name = data['first_name']
        user_changed = True
    if 'last_name' in data:
        user.last_name = data['last_name']
        user_changed = True
    if 'email' in data:
        user.email = data['email']
        user_changed = True
    
    if user_changed:
        user.save()

    # 2. Update Profile Model Fields (Bio, Images) via Serializer
    # We pass 'partial=True' so we don't need to send every field
    serializer = ProfileSerializer(profile, data=data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request):
    """
    Instructs the authenticated user to formally follow a target user.
    Safely prevents users from inadvertently following themselves.
    Updates the cross-relations and follower metadata symmetrically.
    """
    target_user_id = request.data.get('user_id')
    if not target_user_id:
        return Response({'error': 'user_id is required in request body'}, status=status.HTTP_400_BAD_REQUEST)
        
    target_user = get_object_or_404(User, id=target_user_id)
    current_profile = request.user.profile
    
    if request.user == target_user:
        return Response({'error': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
    current_profile.following.add(target_user)
    target_user.profile.followers.add(request.user)
    return Response({'status': 'followed'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request):
    """
    Instructs the authenticated user to correctly unfollow a specific target user.
    Safely deletes the symmetric relation bindings from the respective database clusters.
    """
    target_user_id = request.data.get('user_id')
    if not target_user_id:
        return Response({'error': 'user_id is required in request body'}, status=status.HTTP_400_BAD_REQUEST)
        
    target_user = get_object_or_404(User, id=target_user_id)
    current_profile = request.user.profile
    
    current_profile.following.remove(target_user)
    target_user.profile.followers.remove(request.user)
    return Response({'status': 'unfollowed'})