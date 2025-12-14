from django.db import models
from django.conf import settings  # Use settings.AUTH_USER_MODEL for custom user

# -------------------------------
# Custom User
# -------------------------------
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('Manager', 'Manager'),
        ('User', 'User'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='User')

    def __str__(self):
        return f"{self.username} ({self.role})"

# -------------------------------
# Project Model
# -------------------------------
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')

    STATUS_CHOICES = [
        ("Not Started", "Not Started"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("On Hold", "On Hold"),
        ("Cancelled", "Cancelled"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Not Started")

    def __str__(self):
        return self.name

# -------------------------------
# Task Model
# -------------------------------
class Task(models.Model):
    STATUS_CHOICES = (
        ('ToDo', 'ToDo'),
        ('InProgress', 'InProgress'),
        ('Done', 'Done'),
    )

    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ToDo')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    due_date = models.DateField()

    def __str__(self):
        return self.title
