from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_show = models.BooleanField(default=True)   # User controls this (Hide/Show)
    is_active = models.BooleanField(default=True) # Admin controls this
    image = models.TextField(null=True, blank=True) # Storing Base64 string here

    def __str__(self):
        return self.title
    
