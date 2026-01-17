from django.contrib import admin
from .models import Post, Category, Profile, Comment

# 1. Category Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# 2. Post Admin (With filters for active/show status)
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'is_active', 'is_show', 'created_at')
    list_filter = ('is_active', 'is_show', 'category', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    list_editable = ('is_active', 'is_show') # Allows quick toggling from list view

# 3. Profile Admin
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'followers_count')
    search_fields = ('user__username', 'user__email')

    def followers_count(self, obj):
        return obj.followers.count()
    followers_count.short_description = 'Followers'

# 4. Comment Admin
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'content_snippet', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'content', 'post__title')

    def content_snippet(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_snippet.short_description = 'Comment'