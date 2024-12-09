import sys
import json
import requests
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
                    "role": "system",
                    "content": "You are PV-1.0. You are made by Project Void. Keep your messages simple unless asked otherwise and don't use advanced punctuation or grammar."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.5,
            "max_tokens": 2048
        }

        response = requests.post(
            API_URL,
            headers=headers,
            json=data,
            timeout=30
        )

        if response.status_code != 200:
            return f"API Error: {response.status_code}"

        result = response.json()
        
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content'].strip()
        
        return "Sorry, I could not generate a response."

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print("Error: No message provided", file=sys.stderr)
            sys.exit(1)

        user_message = sys.argv[1]
        response = generate_response(user_message)
        print(response)
        
    except Exception as e:
        print(f"Error in main: {str(e)}", file=sys.stderr)
        sys.exit(1) 