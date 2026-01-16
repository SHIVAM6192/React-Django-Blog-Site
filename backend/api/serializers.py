from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post
from django.contrib.auth.password_validation import validate_password

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Post
        # Add new fields to the list
        fields = ['id', 'title', 'content', 'author', 'created_at', 'is_show', 'is_active', 'image']
        read_only_fields = ['author', 'created_at', 'is_active']
        
        
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