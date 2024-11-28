import os
import json
import re
import requests

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from pdf2image import convert_from_path
from json_repair import repair_json
from huggingface_hub import InferenceClient

from .llm_functions import generate_chat, generate_flashcard, generate_notes, generate_quiz, summarize_text, upload_to_imgbb, extract_text_from_image

from .models import PDFText
from base.models import Subject



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
                if type(quiz) == list:
                    quiz = {"quiz": quiz}
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


def home(request):
    return HttpResponse("""
    <h1>LLM API</hjson>
    <form action="pdf_upload/" method="POST" enctype="multipart/form-data"><input type="file" name="pdf" accept=".pdf" required><button type="submit">Upload PDF</button></form>
""")

# Function to upload image to ImgBB

# Django view to handle PDF upload, convert to images, upload to ImgBB, and extract text
@csrf_exempt
def pdf_upload(request):
    print(request.FILES)
    if request.method == 'POST' and request.FILES.get('pdf'):
        pdf_file = request.FILES['pdf']
        # Save the uploaded PDF file temporarily
        pdf_path = default_storage.save(f'temp_{pdf_file.name}', ContentFile(pdf_file.read()))
        pdf_path_full = os.path.join(default_storage.location, pdf_path)
        # Convert PDF to images
        images = convert_from_path(pdf_path_full, poppler_path=r'D:\Programs\VSCode\Programs\Web projects\Hackathon\CoCo\backend\poppler-24.08.0\Library\bin')
        image_urls = []
        for i, image in enumerate(images):
            # Save each image as a temporary file
            image_path = f'temp_page_{i}.png'
            image.save(image_path, 'PNG')
            
            # Upload image to ImgBB and get the public URL
            print("Uploading image to ImgBB...", image_path)
            img_url = upload_to_imgbb(image_path)
            if img_url:
                image_urls.append(img_url)
            
            # Remove temporary image file after uploading
            os.remove(image_path)
        
        # Remove the temporary PDF file after processing
        os.remove(pdf_path_full)
        print(image_urls)
        # Extract text from each image URL
        print("Extracting text from images...")
        extracted_text = ""
        
        for url in image_urls:
            extracted_text += extract_text_from_image(url)
        
        if len(extracted_text) >= 4096:
            summarized_text = summarize_text(extracted_text)
        else:
            summarized_text = extracted_text
            
        PDFText.objects.create(
            text_content=summarized_text,
            subject = Subject.objects.first()
        )

        return JsonResponse({
            'status': 'success', 
            'message': 'PDF uploaded and text extracted successfully',
            'text': extracted_text
        }, status=200)

        
    
    return JsonResponse({'status': 'error', 'message': 'No PDF file found in request'}, status=400)