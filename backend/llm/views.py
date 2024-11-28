from django.shortcuts import renderf
from django.http import JsonResponse

from .llm_functions import generate_chat, generate_flashcard, generate_notes, generate_quiz

# Create your views here.
def get_note(request):
    if request.method == 'POST':
        context = request.POST.get('context')
        if not context:
            return JsonResponse({'error': 'No context provided'}, status=400)
        else:
            notes = generate_notes(context)
            return JsonResponse({'notes': notes})



def get_quiz(request):
    if request.method == 'POST':
        context = request.POST.get('context')
        if not context:
            return JsonResponse({'error': 'No context provided'}, status=400)
        else:
            notes = generate_notes(context)
            return JsonResponse({'notes': notes})

def get_flashcard(request):
    if request.method == 'POST':
        context = request.POST.get('context')
        if not context:
            return JsonResponse({'error': 'No context provided'}, status=400)
        else:
            notes = generate_notes(context)
            return JsonResponse({'notes': notes})

def get_chat(request):
    if request.method == 'POST':
        context = request.POST.get('context')
        if not context:
            return JsonResponse({'error': 'No context provided'}, status=400)
        else:
            notes = generate_notes(context)
            return JsonResponse({'notes': notes})
