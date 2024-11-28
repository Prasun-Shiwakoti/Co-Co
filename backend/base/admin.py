from django.contrib import admin

# Register your models here.
from .models import Subject,Student

admin.site.register(Subject)
admin.site.register(Student)
