# Deploy Frontend BatikEye ke Vercel

Frontend ini adalah React + Vite single-page app. Deploy dari repo GitHub `BatikEye`, lalu arahkan Vercel ke folder `frontend`.

## Settings Vercel

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Environment Variables

Isi variable ini di Vercel Project Settings, bukan di `.env`:

```text
VITE_API_BASE_URL=https://domain-backend-railway-kamu
VITE_API_WITH_CREDENTIALS=false
```

Catatan:

- `VITE_API_BASE_URL` harus memakai URL public backend Railway.
- Setelah Vercel memberi domain frontend, masukkan domain itu ke `CORS_ORIGINS` di Railway backend.
- Jika punya lebih dari satu domain frontend, pisahkan dengan koma di Railway, contoh `https://batikeye.vercel.app,https://www.batikeye.com`.

## Routing SPA

File `vercel.json` sudah menambahkan rewrite semua route ke `index.html`, supaya halaman seperti `/login`, `/gallery`, `/upload`, dan `/history` tidak 404 saat browser di-refresh.
