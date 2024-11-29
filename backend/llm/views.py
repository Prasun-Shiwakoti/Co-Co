import os
import json

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator 
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from django.core.exceptions import ObjectDoesNotExist

from pdf2image import convert_from_path

from .llm_functions import generate_chat, generate_flashcard, generate_notes, generate_quiz, summarize_text, upload_to_imgbb, extract_text_from_image

from .models import PDFText
from base.models import Subject




# Create your views here.
@csrf_exempt
def get_note(request):
    if request.method == 'GET':
        try:
            id = request.GET.get('id', None)
            if not id:
                return JsonResponse({'error': 'No id provided'}, status=400) 
            try:
                sub = Subject.objects.get(id=id, user__user=request.user)
                pdfs = PDFText.objects.filter(subject=sub)
                context = ""
                for pdf in pdfs:
                    context += pdf.text_content
                notes = generate_notes(context)
                return JsonResponse(notes, status=200)
            except Exception as e:
                return JsonResponse({'error': 'Invalid Subject Code'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)
    

class GetQuizAPIView(APIView):
    """
    API endpoint to generate a quiz based on the provided subject ID.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Handles GET requests to generate a quiz.
        """
        try:
            subject_id = request.query_params.get('id', None)

            if not subject_id:
                return Response({'error': 'No id provided'}, status=HTTP_400_BAD_REQUEST)

            try:
                # Fetch the subject associated with the authenticated user
                sub = Subject.objects.get(id=subject_id, user__user=request.user)

                # Fetch all PDFs related to the subject
                pdfs = PDFText.objects.filter(subject=sub)

                # Construct the context from the text contents of PDFs
                context = ''.join(pdf.text_content for pdf in pdfs)

                # Generate the quiz
                quiz = generate_quiz(context)

                # Wrap the quiz in a dictionary if it's a list
                if isinstance(quiz, list):
                    quiz = {"quiz": quiz}

                return Response(quiz, status=HTTP_200_OK)

            except ObjectDoesNotExist:
                return Response({'error': 'Invalid Subject Code'}, status=HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
        
@csrf_exempt
def get_flashcard(request):
    if request.method == 'GET':
        try:
            id = request.GET.get('id', None)
            if not id:
                return JsonResponse({'error': 'No id provided'}, status=400) 
            try:
                sub = Subject.objects.get(id=id)
                pdfs = PDFText.objects.filter(subject=sub)
                context = ""
                for pdf in pdfs:
                    context += pdf.text_content
                flashcards = generate_flashcard(context)
                return JsonResponse(flashcards, status=200)
            except Exception as e:
                return JsonResponse({'error': 'Invalid Subject Code'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

class GetChatAPIView(APIView):
    """
    API endpoint to handle chat generation based on provided context and prompt.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handles POST requests to process chat requests.
        """
        try:
            data = request.data
            prompt = data.get('prompt', '')
            subject_id = data.get('id', '')

            if not (subject_id and prompt):
                return Response({'error': 'Both Context and Prompt are required'}, status=HTTP_400_BAD_REQUEST)

            try:
                print(Subject.objects.get(id=subject_id), request.user)
                # Fetch the subject associated with the authenticated user
                sub = Subject.objects.get(id=subject_id, user__user=request.user)

                # Fetch all PDFs related to the subject
                pdfs = PDFText.objects.filter(subject=sub)

                # Construct the context from the text contents of PDFs
                context = ''.join(pdf.text_content for pdf in pdfs)

                # Generate the chat response
                chat_response = generate_chat(context, prompt)
                return Response(chat_response, status=HTTP_200_OK)
            except ObjectDoesNotExist:
                return Response({'error': 'Subject not found or unauthorized access'}, status=HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON'}, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_400_BAD_REQUEST)
        
def home(request):
    return HttpResponse("""
    <h1>LLM API</h1>
    <form action="pdf_upload/" method="POST" enctype="multipart/form-data"><input type="file" name="pdf" accept=".pdf" required><button type="submit">Upload PDF</button>
    <input type="text" name="subject_id" placeholder="Subject ID" required>                    
    </form>
""")

# Function to upload image to ImgBB

@csrf_exempt
def pdf_upload(request):
    if request.method == 'POST' and request.FILES.get('pdf'):
        pdf_file = request.FILES['pdf']
        subject_id = request.GET.get('id', None)
        # print(request.GET, subject_id, pdf_file)
        # Save the uploaded PDF file temporarily
        # return JsonResponse({'error': 'Test'}, status=400)
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
        print("Summarized:\t\t\t", summarized_text)
        try:
            try:
                print(subject_id)
                print("Subject ID:\t\t\t", Subject.objects.get(id=subject_id) )
            except:
                return JsonResponse({'error': 'Invalid Subject ID'}, status=400)
            PDFText.objects.create(
                text_content=summarized_text,
                subject = Subject.objects.get(id=subject_id)
            )
        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)}, status=400)

        return JsonResponse({
            'status': 'success', 
            'message': 'PDF uploaded and text extracted successfully',
            'text': extracted_text
        }, status=200)

        
    
    return JsonResponse({'status': 'error', 'message': 'No PDF file found in request'}, status=400)