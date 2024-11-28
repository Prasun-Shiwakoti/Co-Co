from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Student(models.Model):
    name = models.CharField(max_length=100)
    stats = models.JSONField(default=dict, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    
    def __str__(self):
        return f"{self.name}"
    
class Subject(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10, unique=True)
    user = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='subjects')

    def __str__(self):
        return f"{self.code}-{self.name}"


    