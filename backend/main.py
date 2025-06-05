from flask import Flask, request, jsonify
from pathlib import Path
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

API_KEY = Path("services.txt").read_text().strip()

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'Città mancante'}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric&lang=it"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({'error': 'Errore nella richiesta meteo'}), response.status_code

    data = response.json()
    result = {
        'city': data['name'],
        'temperature': data['main']['temp'],
        'description': data['weather'][0]['description'],
        'wind': data['wind']['speed'],
        'icon': data['weather'][0]['icon']
    }

    return jsonify(result)
