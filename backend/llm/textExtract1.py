import requests
from pdf2image import convert_from_path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

# Define the API Key and ImgBB upload endpoint
IMGBB_API_KEY = '22b2b02f510a75b10a767f5c2bc62eea'  # Replace with your API key
IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload'

# Function to upload image to ImgBB
def upload_to_imgbb(image_path):
    with open(image_path, 'rb') as image_file:
        response = requests.post(
            IMGBB_UPLOAD_URL,
            params={'key': IMGBB_API_KEY},
            files={'image': image_file}
        )
        response_data = response.json()
        if response.status_code == 200 and response_data['success']:
            return response_data['data']['url']
        return None

# Function to extract text from image URL
def extract_text_from_image(image_url):
    # Your text extraction logic here, for example using OCR or an API
    # For simplicity, assuming a placeholder function for text extraction
    return f"Extracted text from image URL: {image_url}"

# Django view to handle PDF upload, convert to images, upload to ImgBB, and extract text
@csrf_exempt
def pdf_to_text(request):
    if request.method == 'POST' and request.FILES.get('pdf'):
        pdf_file = request.FILES['pdf']
        
        # Save the uploaded PDF file temporarily
        pdf_path = default_storage.save(f'temp_{pdf_file.name}', ContentFile(pdf_file.read()))
        pdf_path_full = os.path.join(default_storage.location, pdf_path)
        
        # Convert PDF to images
        images = convert_from_path(pdf_path_full)
        
        image_urls = []
        for i, image in enumerate(images):
            # Save each image as a temporary file
            image_path = f'temp_page_{i}.png'
            image.save(image_path, 'PNG')
            
            # Upload image to ImgBB and get the public URL
            img_url = upload_to_imgbb(image_path)
            if img_url:
                image_urls.append(img_url)
            
            # Remove temporary image file after uploading
            os.remove(image_path)
        
        # Remove the temporary PDF file after processing
        os.remove(pdf_path_full)
        
        # Extract text from each image URL
        extracted_text = [extract_text_from_image(url) for url in image_urls]
        
        return JsonResponse({
            'status': 'success',
            'image_urls': image_urls,
            'extracted_text': extracted_text
        })
    
    return JsonResponse({'status': 'error', 'message': 'No PDF file found in request'}, status=400)
