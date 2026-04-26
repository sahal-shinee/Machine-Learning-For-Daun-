# 🌿 Machine Learning For Daun — Deteksi Penyakit Tanaman Berbasis AI

> Aplikasi web berbasis Machine Learning untuk mendeteksi penyakit pada daun tanaman menggunakan **PyTorch** dan **Flask**.

---

## 📌 Deskripsi

**ML For Daun** adalah sistem deteksi penyakit tanaman yang memanfaatkan deep learning untuk mengklasifikasikan kondisi daun dari foto. Pengguna cukup mengunggah gambar daun, dan sistem akan secara otomatis mendeteksi apakah daun tersebut sehat atau terindikasi penyakit tertentu. Proyek ini terdiri dari tiga komponen utama: model AI (PyTorch), backend API (Flask), dan frontend web (HTML/CSS/JS).

---

## ✨ Fitur Utama

- 🔍 **Deteksi Penyakit Otomatis** — Klasifikasi penyakit daun dari gambar menggunakan model deep learning
- ⚡ **Inferensi Cepat** — Model di-load sekali saat server nyala untuk respons yang cepat
- 🌐 **Antarmuka Web** — Frontend yang mudah digunakan langsung di browser
- 📓 **Jupyter Notebooks** — Tersedia notebook untuk eksplorasi data, pelatihan, dan evaluasi model
- 📥 **Script Download Dataset** — Otomatis download dataset dari Kaggle

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|-----------|
| Python | Bahasa pemrograman utama |
| PyTorch | Framework deep learning untuk training & inferensi |
| Torchvision | Preprocessing gambar dan arsitektur model |
| Flask | Backend API server |
| Pillow (PIL) | Pemrosesan gambar |
| HTML / CSS / JS | Frontend antarmuka pengguna |
| Jupyter Notebook | Eksplorasi data dan pelatihan model |
| kagglehub | Download dataset dari Kaggle |

---

## 🗂️ Struktur Direktori

```
Machine-Learning-For-Daun/
├── backend/
│   ├── app.py                  # Flask API server
│   └── predict.py              # Logika inferensi model
├── data/                       # ← Tidak disertakan (lihat bagian Dataset)
│   ├── processed/
│   └── raw/
│       └── New Plant Diseases Dataset(Augmented)/
│           ├── train/
│           ├── valid/
│           └── test/
├── frontend/
│   ├── css/style.css           # Styling antarmuka
│   ├── html/index.html         # Halaman utama
│   └── js/main.js              # Logika frontend
├── model/
│   └── plant_model.pth         # ← Tidak disertakan (hasil training)
├── notebooks/
│   ├── 01_explore_data.ipynb   # Eksplorasi dataset
│   ├── 02_train_model.ipynb    # Pelatihan model
│   └── 03_evaluate.ipynb       # Evaluasi performa model
├── .gitignore
├── donwload_dataset.py         # Script download dataset dari Kaggle
├── README.md
└── requirements.txt
```

---

## 📦 Dataset

Dataset **tidak disertakan** di repository karena ukurannya yang besar (~2.8 GB).

**Dataset:** New Plant Diseases Dataset (Augmented)
🔗 [Download di Kaggle](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset)

### Download Otomatis via Script

```bash
pip install kagglehub
python donwload_dataset.py
```

> **Catatan:** Pastikan sudah login Kaggle dan memiliki file `kaggle.json` di `~/.kaggle/`

Setelah download, pastikan struktur foldernya:
```
data/raw/New Plant Diseases Dataset(Augmented)/
├── train/
├── valid/
└── test/
```

---

## ⚙️ Cara Instalasi & Menjalankan

### Prasyarat
- Python >= 3.8
- pip

### Langkah-langkah

**1. Clone repository**
```bash
git clone https://github.com/sahal-shinee/Machine-Learning-For-Daun-.git
cd Machine-Learning-For-Daun-
```

**2. Install dependensi**
```bash
pip install -r requirements.txt
```

**3. Download dataset**
```bash
python donwload_dataset.py
```

**4. Latih model** (jika belum punya `plant_model.pth`)

Jalankan notebook secara berurutan:
```
01_explore_data.ipynb  →  02_train_model.ipynb  →  03_evaluate.ipynb
```
Model hasil training tersimpan otomatis di `model/plant_model.pth`

**5. Jalankan backend**
```bash
cd backend
python app.py
```

**6. Buka frontend**

Buka `frontend/html/index.html` dengan Live Server di VS Code, atau akses:
```
http://localhost:5000
```

---

## 🧠 Cara Kerja Model

```
Gambar Daun → Preprocessing (Resize + Normalize) → Model PyTorch → Prediksi Penyakit
```

Model dimuat sekali saat server Flask pertama kali nyala via fungsi `load_model()`, sehingga setiap prediksi berikutnya berjalan cepat tanpa perlu reload model.

---

## 📊 Notebook

| Notebook | Deskripsi |
|----------|-----------|
| `01_explore_data.ipynb` | Eksplorasi dan visualisasi dataset |
| `02_train_model.ipynb` | Pelatihan model CNN dengan PyTorch |
| `03_evaluate.ipynb` | Evaluasi akurasi dan performa model |

---

## 👨‍💻 Developer

Dikembangkan oleh **Muhamad Sahal Nurjamil**

[![Instagram](https://img.shields.io/badge/Instagram-@sahaljm__-E4405F?style=flat&logo=instagram)](https://www.instagram.com/sahaljm_/)

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan pembelajaran machine learning.
Dataset yang digunakan tersedia secara publik di Kaggle dengan lisensi terbuka.