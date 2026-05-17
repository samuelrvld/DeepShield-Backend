depedencies yang diperlukan, jalankan di terminal:
pip install fastapi uvicorn tensorflow pillow python-multipart
atau
python -m pip install fastapi uvicorn tensorflow pillow python-multipart

jalankan perintah ini di terminal untuk menjalankan kode menjadi server:
uvicorn main:app
atau
python -m uvicorn main:app

akses servernya jika pakai kode diatas:
http://127.0.0.1:8000/docs
atau
http://localhost:8000/docs

jikalau mau reload otomatis apabila ada perubahan:
uvicorn main:app --reload

jikalau mau menentukan sendiri host dan portnya:
uvicorn main:app --host 0.0.0.0 --port 8000
