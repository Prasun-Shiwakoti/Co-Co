from django.urls import path
from . import views



urlpatterns = [
    path('generate_note/', views.get_note, name='get_note'),
    path('generate_quiz/', views.get_quiz, name='get_quiz'),
    path('generate_flashcard/', views.get_flashcard, name='get_flashcard'),
    path('generate_chat/', views.get_chat, name='get_chat'),
]