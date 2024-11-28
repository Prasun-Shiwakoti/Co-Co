from django.contrib import admin
from django.urls import path
from . import views
from .views import APIView 

urlpatterns=[
    path('',views.home),
    path('student/',views.StudentAPI.as_view()),
    path('login/',views.LoginAPI.as_view()),
]