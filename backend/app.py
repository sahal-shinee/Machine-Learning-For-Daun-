from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
from predict import predict

app = Flask(__name__)
CORS(app)  # Supaya web bisa berkomunikasi dengan server ini

@app.route("/")
def home():
    return jsonify({"status": "LeafScan API berjalan!"})

@app.route("/predict", methods=["POST"])
def predict_disease():
    # Cek apakah ada file yang dikirim
    if "file" not in request.files:
        return jsonify({"error": "Tidak ada file yang dikirim"}), 400
    
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "File kosong"}), 400
    
    try:
        # Baca gambar
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        
        # Prediksi
        results = predict(image)
        
        return jsonify({
            "status": "success",
            "predictions": results
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)