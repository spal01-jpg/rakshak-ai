import os
import zipfile

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ZIP_OUTPUT = os.path.join(BASE_DIR, "Rakshak-AI-Desktop-Setup.zip")

files_to_include = [
    "Rakshak_AI.exe",
    "Start_Rakshak_AI.bat",
    "Install_Desktop_Shortcut.vbs",
    "Rakshak_Offline.html",
    "README_DESKTOP.txt",
    "index.html",
    "manifest.json",
    "sw.js",
    "favicon.ico",
    "server.py",
    "train_model.py",
    "requirements.txt",
    "verify_backend.py",
    "my_tensorflow_model.keras",
    "scaler_mean.npy",
    "scaler_scale.npy",
    "feature_columns.json",
]

dirs_to_include = [
    "css",
    "js",
    "assets",
    "data"
]

print("Building Rakshak-AI-Desktop-Setup.zip...")
with zipfile.ZipFile(ZIP_OUTPUT, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add root files
    for fname in files_to_include:
        fpath = os.path.join(BASE_DIR, fname)
        if os.path.exists(fpath):
            zipf.write(fpath, arcname=os.path.join("Rakshak-AI", fname))
            print(f"  Added file: {fname}")
        else:
            print(f"  Warning: file {fname} not found!")

    # Add directories recursively
    for dname in dirs_to_include:
        dpath = os.path.join(BASE_DIR, dname)
        if os.path.exists(dpath):
            for root, dirs, files in os.walk(dpath):
                # Skip __pycache__
                if "__pycache__" in root:
                    continue
                for file in files:
                    full_p = os.path.join(root, file)
                    rel_p = os.path.relpath(full_p, BASE_DIR)
                    zipf.write(full_p, arcname=os.path.join("Rakshak-AI", rel_p))
            print(f"  Added directory: {dname}")

zip_size_mb = os.path.getsize(ZIP_OUTPUT) / (1024 * 1024)
print(f"\n[OK] Rakshak-AI-Desktop-Setup.zip created successfully! Size: {zip_size_mb:.2f} MB")
