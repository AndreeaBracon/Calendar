from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import CategorySerializer, TaskSerializer
from .models import Category
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return self.request.user.categories.all()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return self.request.user.tasks.all()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


