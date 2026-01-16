from django.urls import path
from . import views
from .views import RegisterView

urlpatterns = [
    path('posts/', views.get_posts, name='get_posts'),
    path('posts/create/', views.create_post, name='create_post'),
    path('logout/', views.LogoutView.as_view(), name='auth_logout'),
    path('profile/', views.get_user_profile, name='get_user_profile'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('my-posts/', views.get_my_posts, name='get_my_posts'),
    path('posts/update/<int:pk>/', views.update_post, name='update_post'),
]