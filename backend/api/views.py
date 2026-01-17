from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Profile, Comment, Category
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import PostSerializer, RegisterSerializer, ProfileSerializer, CommentSerializer, CategorySerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    posts = Post.objects.filter(is_active=True, is_show=True).order_by('-created_at')
    serializer = PostSerializer(posts, many=True, context={'request': request}) 
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_posts(request):
    posts = Post.objects.filter(author=request.user).order_by('-created_at')
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, pk):
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
    data = request.data
    # FIX: Added context={'request': request}
    # Without this, 'get_is_liked' in serializer will fail and cause a 500 error
    serializer = PostSerializer(data=data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
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
    user = request.user
    # Improvement: Using ProfileSerializer ensures consistent data (images, bio, etc.)
    # If you prefer the simple version, you can keep the dictionary method.
    serializer = ProfileSerializer(user.profile, context={'request': request})
    return Response(serializer.data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
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
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, post=post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
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
    user = get_object_or_404(User, username=username)
    serializer = ProfileSerializer(user.profile, context={'request': request})
    
    # Get user's posts
    posts = Post.objects.filter(author=user, is_active=True, is_show=True).order_by('-created_at')
    post_serializer = PostSerializer(posts, many=True, context={'request': request})
    
    return Response({
        'profile': serializer.data,
        'posts': post_serializer.data
    })
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile = request.user.profile
    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow(request, username):
    target_user = get_object_or_404(User, username=username)
    target_profile = target_user.profile
    current_profile = request.user.profile

    if current_profile == target_profile:
        return Response({'error': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)

    if current_profile.following.filter(id=target_profile.id).exists():
        current_profile.following.remove(target_profile)
        return Response({'status': 'unfollowed'})
    else:
        current_profile.following.add(target_profile)
        return Response({'status': 'followed'})