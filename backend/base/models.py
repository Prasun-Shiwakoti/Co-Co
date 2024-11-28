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
    
class Chapter(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)  
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='chapters')

    def __str__(self):
        return f"Chapter: {self.title} (Subject: {self.subject.name})"
    
class Notes(models.Model):
    content = models.TextField()
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='notes')

    def __str__(self):
        return f"Notes: {self.content[:10]} (Chapter: {self.chapter.title})"
    
class Quiz(models.Model):
    questions = models.JSONField(default=dict)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='quizzes')

    def __str__(self):
        return f"Quiz (Chapter: {self.chapter.title})"

class Flashcard(models.Model):
    cards = models.JSONField(default=dict, null=True, blank=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='flashcards')

    def __str__(self):
        return f"Flashcard: {self.text[:10]}... (Chapter: {self.chapter.title})"
    

