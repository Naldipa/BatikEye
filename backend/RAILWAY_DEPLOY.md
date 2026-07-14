# Deploy Backend BatikEye ke Railway

Project ini adalah FastAPI service. Karena repo berisi `frontend/` dan `backend/`, deploy backend dengan root directory `backend`. Railway akan build project dengan Railpack dan menjalankan command dari `railway.toml`.

## 1. File penting

Pastikan file berikut sudah ikut commit:

```text
app/
models/model_Newbatik_saved/
requirements.txt
.python-version
railway.toml
Procfile
.railwayignore
.env.example
.gitignore
RAILWAY_DEPLOY.md
```

File yang tidak perlu dipush:

```text
.env
venv/
.railway/
models/model_Newbatik.h5
models/model_Newbatik.keras
```

## 2. Deploy dari GitHub

1. Buka Railway Dashboard.
2. Pilih **New Project**.
3. Pilih **Deploy from GitHub repo**.
4. Pilih repo BatikEye.
5. Pada service backend, set **Root Directory** ke `backend`.
6. Pastikan Railway membaca `backend/railway.toml`.
7. Klik **Deploy Now**.
8. Setelah deploy selesai, buka service backend.
9. Masuk ke **Settings > Networking** lalu klik **Generate Domain** agar API punya URL public.

Jika Railway meminta start command manual, isi:

```text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 3. Environment variables

Isi variable berikut di Railway service variables, bukan di `.env`:

```text
ENVIRONMENT=production
BACKEND_DEBUG=false
MODEL_PATH=./models/model_Newbatik_saved
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_UPLOAD_BUCKET=uploads
CORS_ORIGINS=https://domain-frontend-kamu.com
```

Catatan:

- `.python-version` sudah mengunci Python ke `3.10.11`.
- `MODEL_PATH=./models/model_Newbatik_saved` harus tetap relatif ke folder `backend`.
- `CORS_ORIGINS` tidak boleh `*` karena backend memakai credentials.
- Di production, `CORS_ORIGINS` tidak boleh berisi `localhost`.
- Kalau frontend juga dideploy di Railway, isi `CORS_ORIGINS` dengan domain public frontend Railway.
- Kalau ada lebih dari satu domain frontend, pisahkan dengan koma tanpa spasi, contoh `https://app.example.com,https://batikeye.up.railway.app`.

## 4. Tes setelah deploy

Setelah domain dibuat, tes:

```text
https://nama-service.up.railway.app/
```

Response sehat:

```json
{"message":"BatikEye API is running"}
```

Dokumentasi API:

```text
https://nama-service.up.railway.app/docs
```

Setelah backend punya domain public, update environment frontend:

```text
VITE_API_BASE_URL=https://nama-service.up.railway.app
```

## 5. Catatan trial Railway

Railway bisa dicoba dengan Free Trial. Jika akun masuk Limited Trial, outbound network bisa dibatasi. Karena backend ini perlu akses keluar ke Supabase, pastikan akun Railway sudah terverifikasi atau gunakan plan yang memberi full network access jika koneksi Supabase gagal.
