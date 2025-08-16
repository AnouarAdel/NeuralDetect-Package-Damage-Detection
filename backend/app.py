import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io

# --- 1. Initialize Flask App and CORS ---
app = Flask(__name__)
CORS(app) 

# --- 2. Load the Trained Model ---
# We use a try-except block to handle potential errors during model loading.
try:
    # Use the name of your final, best-performing model file
    model_path = "transfer_model_best.keras" 
    model = tf.keras.models.load_model(model_path)
    print(f"Model loaded successfully from '{model_path}'")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define the image dimensions the model expects
IMG_HEIGHT = 224
IMG_WIDTH = 224
CLASS_NAMES = ['damaged', 'intact'] # Ensure this order matches your training

# --- 3. Preprocessing Function ---
def preprocess_image(image_bytes):
    """
    Takes image bytes, opens the image, resizes it, converts it to a NumPy array,
    and prepares it for the model.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    
    # Rescale the image pixel values from [0, 255] to [0, 1] as done during training
    img_array = img_array / 255.0
    
    # Add a batch dimension, as the model expects a batch of images
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

# --- 4. Define the Prediction API Endpoint ---
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model is not loaded or failed to load."}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No file selected for uploading."}), 400

    try:
        # Read the image file from the request
        image_bytes = file.read()
        
        # Preprocess the image
        processed_image = preprocess_image(image_bytes)
        
        # Get model's prediction
        predictions = model.predict(processed_image)
        
        # Get the predicted class index and confidence score
        predicted_class_index = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions, axis=1)[0])
        predicted_class_name = CLASS_NAMES[predicted_class_index]
        
        # Create a professional JSON response
        return jsonify({
            "prediction": predicted_class_name,
            "confidence": f"{confidence:.2%}" # Format as a percentage
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

# --- 5. Run the Flask Server ---
if __name__ == "__main__":
    print("Starting the NeuralDetect backend server...")
    # host='0.0.0.0' makes the server accessible on your local network
    app.run(debug=False, host='0.0.0.0', port=5000)