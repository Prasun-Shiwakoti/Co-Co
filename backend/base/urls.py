from django.urls import path
from . import views
from .views import StudentAPI, LoginAPI, SubjectAPI, NotesAPI, QuizAPI, FlashcardAPI, QuizReportAPI


urlpatterns=[
    path('',views.home, name="home"),
    path('student/',StudentAPI.as_view()),
    path('login/',LoginAPI.as_view()),
    path("subject/", SubjectAPI.as_view()),
    #path("chapter/",ChapterAPI.as_view()),
    path("note/",NotesAPI.as_view()),   
    path("quiz/",QuizAPI.as_view()),
    path("flashcard/",FlashcardAPI.as_view()), 
    path("quiz_report/", QuizReportAPI.as_view()),
    path('generate_study_plan/', views.generate_study_plan, name='generate_study_plan'),
]