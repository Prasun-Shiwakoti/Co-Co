from django.urls import path
from . import views
from .views import StudentAPI, LoginAPI, SubjectAPI, ChapterAPI


urlpatterns=[
    path('',views.home, name="home"),
    path('student/',StudentAPI.as_view()),
    path('login/',LoginAPI.as_view()),
    path("subject/", SubjectAPI.as_view()),
    path("chapter/",ChapterAPI.as_view()),
]