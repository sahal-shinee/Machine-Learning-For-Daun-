import kagglehub
import shutil
import os

# Download dataset
path = kagglehub.dataset_download("vipoooool/new-plant-diseases-dataset")
print("Downloaded ke:", path)

# Pindahkan ke folder data/raw/
dest = "data/raw"
os.makedirs(dest, exist_ok=True)
shutil.copytree(path, dest, dirs_exist_ok=True)

print("Dataset berhasil disimpan di:", dest)