from huggingface_hub import InferenceClient

client = InferenceClient(api_key="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

messages = [
	{
		"role": "user",
		"content": "What is the capital of France?"
	}
]

def callAPI(messages, model="meta-llama/Llama-3.2-3B-Instruct", max_tokens=200, temperature=0.7):
    completion = client.chat.completions.create(
        model=model, 
        messages=messages, 
        max_tokens=max_tokens,
        temperature=temperature
    )
    return completion


completion = client.chat.completions.create(
    model="meta-llama/Llama-3.2-3B-Instruct", 
	messages=messages, 
	max_tokens=500
)

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
    return notes


def generate_quiz(context):
    quiz_messages = [
        {
            "role": "system",
            "content": """You are a teacher. You are creating a quiz for your students. You need to generate questions and answers for the quiz. 
        Requirements:
        1. The questions should be multiple choice questions. The answers should be one of the choices in the multiple choice questions. Include all type of questions like true/false, multiple choice, etc.
        2. The questions should be relevant to the content provided in the messages. Generate unique quesitons and answers ervery time.
        3. Always respond in json format: {[{"question":"question", "choices":["choice1", "choice2", "choice3", "choice4"], "answer":"answer"},...]}
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
    return questions


def generate_flashcard(context):
    flashcards_messages = [
        {
            "role": "system",
            "content": """You are creating flashcards based on the provided context. 
            Requirements:
            1. The flashcards should contian key points from the content provided in the messages.
            2. The points should be clear and concise.
            3. Always respond in JSON format:
                {"flashcards":["information1", "information2", "information3", ...]}
            4. Output only the JSON. Do not include any additional explanation, headers, or text.
            5. Double-check the correctness of json format before submitting.
            """
        },
        {
            "role": "user",
            "content": f"""Generate flashcards based on the context provided below: 
            Context: {context}"""
        }

    ]

    flashcards = callAPI(flashcards_messages)
    return flashcards


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
    return completion




# print(completion.choices[0].message)