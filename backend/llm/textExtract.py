from huggingface_hub import InferenceClient
import json
import re
from json_repair import repair_json

client = InferenceClient(api_key="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")

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
        print("\n\n\nThis was the repaired string:", repaird_s)
        return json.loads(repaird_s)

def extract_text_from_image(url):
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
                        2. Output only the text in image. Do not include any additional explanation, headers, or text.
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


urls = ['https://i.ibb.co/Fgk1X6T/temp-page-0.png', 'https://i.ibb.co/vL0T75j/temp-page-1.png', 'https://i.ibb.co/cCF76rC/temp-page-2.png', 'https://i.ibb.co/R4R8VvM/temp-page-3.png', 'https://i.ibb.co/Ltb0LkD/temp-page-4.png', 'https://i.ibb.co/ngw5VFW/temp-page-5.png', 'https://i.ibb.co/SXnLQvx/temp-page-6.png', 'https://i.ibb.co/M8XP6Yr/temp-page-7.png', 'https://i.ibb.co/Y2J9LPg/temp-page-8.png', 'https://i.ibb.co/ZMfn8mH/temp-page-9.png', 'https://i.ibb.co/hVqtK8n/temp-page-10.png']

for url in urls:
    print("Extracting text from image...", url)
    print(extract_text_from_image(url))