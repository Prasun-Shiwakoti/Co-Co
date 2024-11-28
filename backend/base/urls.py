from django.urls import path
from . import views
from .views import StudentAPI, LoginAPI, SubjectAPI, ChapterAPI, NotesAPI, QuizAPI, FlashcardAPI


urlpatterns=[
    path('',views.home, name="home"),
    path('student/',StudentAPI.as_view()),
    path('login/',LoginAPI.as_view()),
    path("subject/", SubjectAPI.as_view()),
    path("chapter/",ChapterAPI.as_view()),
    path("note/",NotesAPI.as_view()),   
    path("quiz/",QuizAPI.as_view()),
    path("flashcard/",FlashcardAPI.as_view()), 
]