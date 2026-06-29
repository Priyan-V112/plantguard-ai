from click import prompt
from flask import Flask, request, jsonify
from groq import Groq
import os
from dotenv import load_dotenv
import tensorflow as tf
import numpy as np
from flask_cors import CORS

load_dotenv()

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model("model.h5")

class_names = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]
def prepare_image(image):
    image = np.array(image, dtype=np.float32)

    image = tf.image.resize(image, (128, 128))

    image = image / 255.0

    image = np.expand_dims(image, axis=0)

    return image
@app.route("/")
def home():
    return "Backend is working 🚀"
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    image = data["image"]

    processed_image = prepare_image(image)

    prediction = model.predict(processed_image)

    predicted_index = np.argmax(prediction)
    confidence = float(np.max(prediction))
    disease = class_names[predicted_index]

    prompt = f"""
    Disease detected: {disease}
    Confidence: {confidence*100:.2f}%

    Provide:
    1. Disease explanation
    2. Causes
    3. Treatment
    4. Prevention

    Keep response clear and short.
    """

    treatment_response = get_bot_response(prompt)

    return jsonify({
    "disease": disease,
    "confidence": confidence,
    "treatment": treatment_response
})
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"

messages = [
    {
        "role": "system",
        "content": """
        You are PlantCare AI, an expert assistant in plant disease detection and plant care.

        Your role:
        - Answer ONLY questions related to plants, crops, farming, gardening, plant diseases, pests, fertilizers, soil, and nature.
        - Help users identify plant diseases based on symptoms.
        - Suggest possible causes, prevention, and treatment methods.
        - Give simple and practical advice.

        Strict rules:
        - Do NOT answer questions unrelated to plants, farming, agriculture, or nature.
        - If user asks unrelated questions, politely say:
          "I am PlantCare AI, specialized in plant disease detection, crop health analysis, agriculture, gardening, and nature-related guidance. I can only respond to queries within these domains."
        Special interaction rules:
        - If the user says "thanks", "thank you", "ok", "okay", "bye", "goodbye", "no" or "no need",
        respond politely and naturally.
            Response style:
            - Clear
            - Friendly
            - Short but useful
        """
    }
]

def get_bot_response(user_input):
    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=500
    )

    reply = response.choices[0].message.content

    messages.append({"role": "assistant", "content": reply})

    return reply



@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    user_message = data["message"]

    reply = get_bot_response(user_message)

    return jsonify({"response": reply})


if __name__ == "__main__":
    app.run(debug=True)