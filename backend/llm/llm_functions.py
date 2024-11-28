from huggingface_hub import InferenceClient

client = InferenceClient(api_key="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

messages = [
	{
		"role": "user",
		"content": "What is the capital of France?"
	}
]

completion = client.chat.completions.create(
    model="meta-llama/Llama-3.2-3B-Instruct", 
	messages=messages, 
	max_tokens=500
)

def generate_notes(context):
    pass

def generate_quiz(context):
    pass

def generate_flashcard(context):
    pass

def generate_chat(context, prompt):
    pass


# print(completion.choices[0].message)