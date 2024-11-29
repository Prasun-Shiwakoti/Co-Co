from huggingface_hub import InferenceClient
import json
import json_repair
from json_repair import repair_json
import re
import requests


# Define the API Key and ImgBB upload endpoint
IMGBB_API_KEY = '22b2b02f510a75b10a767f5c2bc62eea'  # Replace with your API key
IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload'
HUGGINGFACE_API_KEY = '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'

client = InferenceClient(api_key=HUGGINGFACE_API_KEY)

def remove_special_sequences(input_string):
    # Replace special escape sequences with a single space
    input_string = re.sub(r'\s+', ' ', input_string).strip()
    special_sequences = [r'\n', r'\t', r'\r', r'\v', r'\a', '\n', '\t', '\r', '\v', '\a']
    for sequence in special_sequences:
        input_string = input_string.replace(sequence, '')
    return input_string

def parse_json_garbage(s):
    cleaned_s = remove_special_sequences(s)
    parsed_s = cleaned_s[next(idx for idx, c in enumerate(s) if c in "{["):]
    try:
        return json.loads(s)
    except json.JSONDecodeError as e:
        print("\n\n\nThis was the string:", parsed_s)
        print("\n\n\nThis was the error:", e)
        repaird_s = repair_json(parsed_s)
        print("\n\n\nThis was the repaired string:", json.loads(repaird_s))
        try:
            return json_repair.loads(repaird_s)
        except:
            raise Exception

def callAPI(messages, model="meta-llama/Llama-3.2-3B-Instruct", max_tokens=2048, temperature=0.1):
    completion = client.chat.completions.create(
        model=model, 
        messages=messages, 
        max_tokens=max_tokens,
        temperature=temperature,
        # response_format="json",
    )
    return completion


def generate_notes(context):
    notes_messages =  [
        {
            "role": "system",
            "content": """You are a student. You are creating notes for yourself. You need to generate notes based on the content provided in the messages. 
                Requirements:
                1. The notes should be concise and relevant to the content provided in the messages.Notes should be easy to understand and should contain only the key points.
                2. Use markdown and LaTeX if needed for better readability.
                3. Always respond in json format: {"notes":"notes"}.
                4. Output only the JSON. Do not include any additional explanation, headers, or text.
                5. Double-check the correctness of your response format and notes before submitting.
        """
        },

        {
            "role": "user",
            "content": f"""Generate notes based on context given below:
                Context: {context}
            """
        }
    ]
    
    notes = callAPI(notes_messages)
    try:
        notes_json = parse_json_garbage(notes.choices[0].message.content)
    except:

        notes_messages[1]['content'] += "\nRequirement: Strictly follow the JSON format"
        notes = callAPI(notes_messages)
        notes_json = parse_json_garbage(notes.choices[0].message.content)
    return notes_json


def generate_quiz(context):
    quiz_messages = [
        {
            "role": "system",
            "content": """You are a teacher. You are creating a quiz for your students. You need to generate questions and answers for the quiz. 
        Requirements:
        1. The questions should be multiple choice questions. The answers should be one of the choices in the multiple choice questions. Include all type of questions like true/false, multiple choice, etc.
        2. The questions should be relevant to the content provided in the messages. Generate unique quesitons and answers ervery time.
        3. Always respond in json format: {"questions": [{"question":"question", "choices":["choice1", "choice2", "choice3", "choice4"], "answer":"answer"},...]}
        4. Output only the JSON. Do not include any additional explanation, headers, or text.
        5. Double-check the correctness of your response format, questions and answers before submitting.
        """
        },

        {
            "role": "user",
            "content": f"""Generate multiple choice question based on context given below:
                Context: {context}
            """
        }
    ]

    questions = callAPI(quiz_messages)
    for _ in range(3):
        try:
            quiz_json = parse_json_garbage(questions.choices[0].message.content)
            break
        except:
            quiz_messages[1]['content'] += "\nRequirement: Strictly follow the JSON format"
            quiz_messages = callAPI(quiz_messages)
            quiz_json = parse_json_garbage(quiz_messages.choices[0].message.content)
    return quiz_json


def generate_flashcard(context):
    flashcards_messages = [
        {
            "role": "system",
            "content": """You are creating flashcards based on the provided context. 
            Requirements:
            1. The flashcards should contian key points from the content provided in the messages.
            2. The points should be clear and concise.
            3. Always respond in JSON format. It contains a key with list of flashcards.:
                {"flashcards":["information1", "information2", "information3", ...]}
            4. Output only the JSON. Do not include any additional explanation, headers, or text.
            5. Double-check and validate the correctness of json format before submitting.
            """
        },
        {
            "role": "user",
            "content": f"""Generate flashcards based on the context provided below: 
            Context: {context}"""
        }

    ]

    flashcards = callAPI(flashcards_messages)
    for _ in range(3):
        try:
            flashcards_json = parse_json_garbage(flashcards.choices[0].message.content)
            break
        except:
            flashcards_messages[1]['content'] += "\nRequirement: Strictly follow the JSON format"
            flashcards = callAPI(flashcards_messages)
    
    return flashcards_json

def generate_chat(context, prompt):
    messages = [
        {
            "role": "system",
            "content": """You are a helpful AI assistant. Be conversational and friendly. Reply based on the context provided as long as it contains required information else use your own knowledge to generate a response."""
        },
        
        {
            "role": "user",
            "content": f"""Context: {context}
                User Prompt: {prompt}"""
        }
    ]
    completion = callAPI(messages)
    response = completion.choices[0].message.content
    return response

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

def extract_text_from_image(url):
    print("Extracting text from image...", url)
    img_url = url 
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": """Extract the text from the image. 
                        Requirements: 
                        1. Use markdown or LaTeX wherever needed.
                        2. Output only the text. Do not include any additional explanation, headers, or text.
                        3. Double check the correctness of your response before submitting.
                    """
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": img_url
                    }
                }
            ]
        }
    ]
    stream = client.chat.completions.create(
        model="meta-llama/Llama-3.2-11B-Vision-Instruct",
        messages=messages,
        max_tokens=2000,
        stream=True
    )
    extracted_text = ""
    for chunk in stream:
        extracted_text += chunk.choices[0].delta.content

    return extracted_text
    extracted_text = remove_special_sequences(extracted_text)
    parsed_text = parse_json_garbage(extracted_text)
    return parsed_text

def summarize_text(text):
    API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"    
    text_chunk = []
    
    while text:
        chunk = text[:1000]
        text = text[1000:]
        text_chunk.append(chunk)

    summarized_text = ""
    print("Summarizing text chunks...")
    print(len(text_chunk))
    
    for ind, chunk in enumerate(text_chunk):
        print("Summarizing chunk...", ind)
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

        payload = {
            "inputs": chunk
        }
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=10)
        except:
            continue
        try:
            summarized_text += response.json()[0].get("summary_text", "")
            print("\n\nSummarized chunk:", ind)
        except Exception as e:
            print("\n\nError:", response.json())
            

    # print(summarized_text)
    return summarized_text


