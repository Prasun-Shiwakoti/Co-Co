from django.urls import path
from . import views



urlpatterns = [
    path("", views.home, name="home"),
    path('pdf_upload/', views.pdf_upload, name='upload_pdf'),
    path('generate_note/', views.get_note, name='get_note'),
    path('generate_quiz/', views.GetQuizAPIView.as_view(), name='get_quiz'),
    path('generate_flashcard/', views.get_flashcard, name='get_flashcard'),
    path('generate_chat/', views.GetChatAPIView.as_view(), name='get_chat'),
]