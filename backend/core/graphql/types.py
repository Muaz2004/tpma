from graphene_django import DjangoObjectType
from core.models import CustomUser, Project, Task

class UserType(DjangoObjectType):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "first_name", "email", "role")

class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = ("id", "name", "description", "start_date", "end_date", "creator", "tasks", "status")

class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = ("id", "title", "description", "status", "assigned_to", "project", "due_date")

