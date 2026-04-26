import torch
from torchvision import transforms, models
from PIL import Image
import json

# Load model saat server pertama kali nyala
def load_model():
    checkpoint = torch.load(
        "../model/plant_model.pth",
        map_location=torch.device("cpu")
    )
    class_names = checkpoint["class_names"]
    
    model = models.resnet18(weights=None)
    model.fc = torch.nn.Linear(model.fc.in_features, len(class_names))
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()
    
    return model, class_names

# Transformasi gambar yang diupload user
def transform_image(image):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0)

# Fungsi prediksi utama
def predict(image):
    model, class_names = load_model()
    
    tensor = transform_image(image)
    
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
    
    # Ambil top 3 prediksi
    top3_prob, top3_idx = torch.topk(probabilities, 3)
    
    results = []
    for prob, idx in zip(top3_prob, top3_idx):
        label = class_names[idx]
        # Pisahkan nama tanaman dan penyakit
        parts = label.split("___")
        plant = parts[0].replace("_", " ")
        disease = parts[1].replace("_", " ") if len(parts) > 1 else "Unknown"
        
        results.append({
            "plant": plant,
            "disease": disease,
            "confidence": round(prob.item() * 100, 2),
            "is_healthy": "healthy" in disease.lower()
        })
    
    return results