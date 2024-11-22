import requests
import sys
import json
import os
from dotenv import load_dotenv

# Load environment variables from /var/www/.env
load_dotenv('/var/www/.env')

# Get API configuration from environment
API_KEY = os.getenv('TOGETHER_API_KEY')
API_URL = os.getenv('TOGETHER_API_URL')

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
                    "content": """You are PV-1.0, an AI made by Project Void."""
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 800
        }

        response = requests.post(
            API_URL,
            headers=headers,
            json=data,
            timeout=30
        )

        if response.status_code != 200:
            return f"API Error: {response.status_code} - {response.text}"

        result = response.json()
        
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content']
        else:
            return "Sorry, I could not generate a response."

    except Exception as e:
        print(f"Error type: {type(e)}")
        print(f"Error details: {str(e)}")
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_message = sys.argv[1]
        response = generate_response(user_message)
        print(response) 