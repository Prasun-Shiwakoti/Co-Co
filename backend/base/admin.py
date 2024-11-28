from django.contrib import admin

# Register your models here.
from .models import Subject,Student,Chapter,Notes,Quiz, Flashcard

admin.site.register(Subject)
admin.site.register(Student)
admin.site.register(Chapter)
admin.site.register(Notes)
admin.site.register(Quiz)
admin.site.register(Flashcard)
