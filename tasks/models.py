from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)
    reminder = models.DateTimeField(auto_now_add=False,default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User,
        related_name = "categories", on_delete=models.CASCADE)
    
    
class Task(models.Model):
    def get_default_category(user=None):
    # If no user is provided, get or create a default system user
        if user is None:
            user = User.objects.get_or_create(username='system', defaults={'is_staff': True, 'is_superuser': True})[0]
    # Now get or create the default category with the provided user
        return Category.objects.get_or_create(name='Default', defaults={'created_by': user})[0]

    
    name = models.CharField(max_length=100)
    start =  models.DateTimeField(auto_now_add=False)
    end =   models.DateTimeField(auto_now_add=False)
    category = models.ForeignKey(Category, blank=True,related_name="tasks", on_delete=models.SET_NULL, null=True, default=get_default_category)
    created_by = models.ForeignKey(User,
        related_name = "tasks", on_delete=models.CASCADE)
    all_day = models.BooleanField(default=False)