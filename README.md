## Features

- Upload gambar melalui API
- Prediksi **Real / Fake**
- Confidence score
- Probability tiap kelas
- Penjelasan otomatis menggunakan Generative AI
- Dokumentasi API otomatis (Swagger UI)

---

## Requirements

Pastikan sudah menginstall:

- Python **3.10+** (disarankan)
- pip

---

Install dependencies:

```bash
pip install fastapi uvicorn tensorflow pillow python-multipart groq python-dotenv
```

atau:

```bash
python -m pip install fastapi uvicorn tensorflow pillow python-multipart groq python-dotenv
```

---

## Environment Variables

Project ini menggunakan file `.env` untuk menyimpan credential.

Buat file:

```text
.env
```

Isi:

```env
GROQ_API_KEY=YOUR_API_KEY
```

Ganti:

```text
YOUR_API_KEY
```

dengan API key milik Anda.

---

## Run Server

### Default Mode

Menjalankan server:

```bash
uvicorn main:app
```

atau:

```bash
python -m uvicorn main:app
```

---

### Development Mode (Auto Reload)

Agar server otomatis restart saat ada perubahan kode:

```bash
uvicorn main:app --reload
```

---

### Custom Host and Port

Menentukan host dan port sendiri:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Contoh:

```bash
uvicorn main:app --host 127.0.0.1 --port 5000
```

---

## API Documentation

Setelah server berjalan bisa lihat atau tes dengan UI:

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

atau

```text
http://localhost:8000/docs
```

---

