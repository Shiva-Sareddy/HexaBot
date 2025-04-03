# ollama_service.py
from flask import Flask, request, jsonify, stream_with_context, Response
import requests
import json

app = Flask(__name__)

def generate_ollama_response(prompt):
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "llama3",
        "prompt": f"HexaBot : A personalized AI chat assistant. {prompt}"
    }
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(url, data=json.dumps(payload), stream=True)
        response.raise_for_status()
        for line in response.iter_lines():
            if line:
                json_line = json.loads(line)
                if 'response' in json_line:
                    yield json_line['response']

    except requests.exceptions.RequestException as e:
        print(f"Error during Ollama request: {e}")
        yield "An error occurred while processing your request."

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    message = data['message']

    def stream():
        for response_chunk in generate_ollama_response(message):
            yield response_chunk

    def final_response():
        full_response = "".join(stream())
        yield full_response

    return Response(stream_with_context(final_response()))

if __name__ == '__main__':
    app.run(port=5001, debug=True)