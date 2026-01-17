from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post
from django.contrib.auth.password_validation import validate_password

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    author_first_name = serializers.ReadOnlyField(source='author.first_name')
    author_last_name = serializers.ReadOnlyField(source='author.last_name')

    class Meta:
        model = Post
        # Add new fields to the list
        fields = ['id', 'title', 'content', 'author_username', 'author_first_name', 'author_last_name', 'created_at', 'is_show', 'is_active', 'image']
        read_only_fields = ['author_username', 'created_at', 'is_active']
        
        
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user