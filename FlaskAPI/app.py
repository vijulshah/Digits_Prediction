from flask import Flask, request
from flask_cors import CORS
import json
import numpy as np
from torchvision import transforms
import torch
from PIL import Image
import torch.nn.functional as F

def predict_real_img(image_file, model):
    img = Image.open(image_file).convert(mode="L")
    img = img.resize((28, 28))
    # x = (255 - np.expand_dims(np.array(img), -1))/255.
    x = (np.expand_dims(np.array(img), -1))/255.
    with torch.no_grad():
        T = transforms.Compose([
            transforms.ToTensor()
        ])
        pred = model(torch.unsqueeze(T(x), axis=0).float())
        return F.softmax(pred, dim=-1).numpy()

app = Flask(__name__)
CORS(app)

@app.route('/predict-digit-from-image', methods=['POST'])
def predict():
    print("request files", request.files)
    image_file = request.files['image']
    
    digits_model = torch.load("models/MNIST_Digit_Prediction_Model")
    pred = predict_real_img(image_file, digits_model)
    pred_idx = np.argmax(pred)
    prob = "{:.2f}".format(pred[0][pred_idx]*100)
    print(f"predicted: {pred_idx}, prob: {prob} %")

    responseCode = 200
    responseData = json.dumps({
        'predicted_number': str(pred_idx),
        'prediction_probability': f"{prob} %"
    })
    return responseData, responseCode

if __name__ == '__main__':
    app.run(debug=True)