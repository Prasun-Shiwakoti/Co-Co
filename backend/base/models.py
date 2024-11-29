from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Student(models.Model):
    name = models.CharField(max_length=100)
    streak_count = models.IntegerField(default=0)
    stats = models.JSONField(default=dict, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    last_activity_date = models.DateField(auto_now=True)

    def reset_streak(self):
        self.streak_count = 0
        self.save()

    def increment_streak(self):
        self.streak_count += 1
        self.save()

    def __str__(self):
        return f"{self.name}"
    
    def __str__(self):
        return f"{self.name}"
    
class Subject(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10, unique=True, default='DEFAULT')
    user = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='subjects')

    def __str__(self):
        return f"{self.code}-{self.name}"
    
# class Chapter(models.Model):
#     title = models.CharField(max_length=100)
#     description = models.TextField(blank=True, null=True)  
#     subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='chapters')

#     def __str__(self):
#         return f"Chapter: {self.title} (Subject: {self.subject.name})"
    
class Notes(models.Model):
    code = models.CharField(max_length=10, unique=True, default='DEFAULT')
    content = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='notes')

    def __str__(self):
        return f"Notes: {self.content[:10]} (Subject: {self.subject.name}) (Code:{self.code})"
    
class Quiz(models.Model):
    code = models.CharField(max_length=10, unique=True, default='DEFAULT')
    questions = models.JSONField(default=dict)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='quizzes')

    def __str__(self):
        return f"Quiz (Chapter: {self.subject.name})"

class Flashcard(models.Model):
    cards = models.JSONField(default=dict, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='flashcards')

    def __str__(self):
        return f"Flashcard: {self.cards}... (Chapter: {self.subject.name})"
    

