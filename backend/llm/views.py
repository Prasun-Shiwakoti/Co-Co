from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


from .llm_functions import generate_chat, generate_flashcard, generate_notes, generate_quiz

# Create your views here.
@csrf_exempt
def get_note(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            context = data.get('context', '') 
            if not context:
                return JsonResponse({'error': 'No context provided'}, status=400)
            else:
                notes = generate_notes(context)
                return JsonResponse(notes, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)
    


@csrf_exempt
def get_quiz(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            context = data.get('context', '') 
            if not context:
                return JsonResponse({'error': 'No context provided'}, status=400)
            else:
                quiz = generate_quiz(context)
                return JsonResponse(quiz, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)
        
@csrf_exempt
def get_flashcard(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            context = data.get('context', '') 
            if not context:
                return JsonResponse({'error': 'No context provided'}, status=400)
            else:
                flashcard = generate_flashcard(context)
                return JsonResponse(flashcard, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def get_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            prompt = data.get('prompt', '')
            context = data.get('context', '') 
            if not (context and prompt):
                return JsonResponse({'error': 'Both Context and Prompt is required'}, status=400)
            else:
                chat = generate_chat(context, prompt)
                return JsonResponse({"response": chat}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


def uplaod_pdf(request):
    pass