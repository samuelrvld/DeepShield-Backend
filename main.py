import io
import numpy as np
import tensorflow as tf

from fastapi import FastAPI, UploadFile, File
from tensorflow.keras.models import load_model
from PIL import Image

# FastAPI App
app = FastAPI()

# Load Model & Labels
MODEL_PATH = "model.keras"
LABEL_PATH = "label.txt"

model = load_model(MODEL_PATH)

with open(LABEL_PATH, "r") as f:
    labels = [line.strip() for line in f.readlines()]



# Preprocessing Function
def preprocess_image(
    image_bytes,
    image_size=(160, 160),
    color_mode="rgb"
):

    # Read image using PIL
    img = Image.open(io.BytesIO(image_bytes))

    # RGB / Grayscale
    if color_mode == "rgb":
        img = img.convert("RGB")
    else:
        img = img.convert("L")

    # Resize
    img = img.resize(image_size)

    # Convert to numpy
    img_array = np.array(img)

    # Normalize
    img_array = img_array.astype("float32") / 255.0

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    return img_array



# Prediction Endpoint
@app.post("/predict")
async def predict_image(
    file: UploadFile = File(...),
    threshold: float = 0.5
):

    # Read uploaded image
    image_bytes = await file.read()

    # Preprocess
    img_array = preprocess_image(
        image_bytes=image_bytes,
        image_size=(160, 160),
        color_mode="rgb"
    )

    # Prediction
    prediction = model.predict(img_array, verbose=0)

    # Sigmoid score
    score = float(prediction[0][0])

    # Probabilities
    probabilities = {
        labels[0]: float((1 - score) * 100),
        labels[1]: float(score * 100)
    }

    # Determine class
    pred_index = 1 if score > threshold else 0
    pred_label = labels[pred_index]
    confidence = probabilities[pred_label]

    # Response JSON
    return {
        "filename": file.filename,
        "prediction": pred_label,
        "confidence": confidence,
        "probabilities": probabilities,
        "raw_score": score
    }