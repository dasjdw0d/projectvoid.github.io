import requests
import sys
import json
import os
from dotenv import load_dotenv

# Load environment variables from /var/www/.env
load_dotenv('/var/www/.env')

# Get API configuration from environment
API_KEY = os.getenv('DEEPINFRA_API_KEY')
API_URL = "https://api.deepinfra.com/v1/openai/chat/completions"

def generate_response(prompt):
    try:
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }
        
        data = {
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 4096
        }

        # Debug print
        print(f"Sending request with data: {json.dumps(data)}", file=sys.stderr)

        response = requests.post(
            API_URL,
            headers=headers,
            json=data,
            timeout=30
        )

        # Debug print
        print(f"Response status: {response.status_code}", file=sys.stderr)
        print(f"Response text: {response.text}", file=sys.stderr)

        if response.status_code != 200:
            return f"API Error: {response.status_code} - {response.text}"

        result = response.json()
        
        # Debug print
        print(f"Parsed JSON result: {json.dumps(result)}", file=sys.stderr)

        # OpenAI format response parsing
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content']
        
        return "Sorry, I could not generate a response."

    except Exception as e:
        print(f"Error type: {type(e)}", file=sys.stderr)
        print(f"Error details: {str(e)}", file=sys.stderr)
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_message = sys.argv[1]
        response = generate_response(user_message)
        print(response) 