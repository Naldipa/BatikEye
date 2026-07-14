# BatikEye Backend

Backend BatikEye adalah FastAPI service untuk autentikasi, data motif, riwayat upload, upload gambar ke Supabase Storage, dan prediksi motif batik menggunakan model TensorFlow SavedModel.

## Tech Stack

- FastAPI
- Uvicorn
- TensorFlow / Keras
- Supabase
- OpenCV Headless
- Pillow

## Prerequisites

- Python 3.10.11
- Supabase project
- Supabase Storage bucket untuk upload gambar
- Model tersedia di `models/model_Newbatik_saved`

## Environment Variables

Buat file `.env` dari `.env.example` untuk development lokal:

```text
ENVIRONMENT=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_UPLOAD_BUCKET=uploads
MODEL_PATH=./models/model_Newbatik_saved
CORS_ORIGINS=http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:4173
BACKEND_DEBUG=false
```

Untuk production di Railway, isi environment variables lewat dashboard Railway, bukan lewat `.env`.

## Development

Install dependencies:

```bash
pip install -r requirements.txt
```

Jalankan API:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Health check:

```text
http://127.0.0.1:8000/
```

Dokumentasi API:

```text
http://127.0.0.1:8000/docs
```

## Deploy ke Railway

Deploy dari repo GitHub `BatikEye`, lalu gunakan konfigurasi:

```text
Root Directory: backend
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

File `railway.toml` dan `Procfile` sudah disiapkan untuk Railway.

Environment variables production:

```text
ENVIRONMENT=production
BACKEND_DEBUG=false
MODEL_PATH=./models/model_Newbatik_saved
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_UPLOAD_BUCKET=uploads
CORS_ORIGINS=https://domain-frontend-kamu
```

Panduan lengkap ada di `RAILWAY_DEPLOY.md`.

## Notes

- `.env` tidak boleh dipush ke GitHub.
- `CORS_ORIGINS` production harus berisi domain frontend, bukan `localhost`.
- `MODEL_PATH` harus tetap mengarah ke model SavedModel yang ikut dipush.
