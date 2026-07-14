# BatikEye Frontend

Frontend BatikEye adalah aplikasi React + Vite untuk eksplorasi motif batik, autentikasi pengguna, upload gambar, prediksi motif batik, riwayat prediksi, galeri motif, dan dukungan PWA.

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- i18next
- Vite PWA

## Prerequisites

- Node.js
- npm
- Backend BatikEye berjalan lokal atau sudah dideploy ke Railway

## Environment Variables

Buat file `.env` dari `.env.example` untuk development lokal:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_WITH_CREDENTIALS=false
```

Untuk production di Vercel:

```text
VITE_API_BASE_URL=https://domain-backend-railway-kamu
VITE_API_WITH_CREDENTIALS=false
```

`VITE_API_BASE_URL` harus mengarah ke URL public backend Railway.

## Development

Install dependencies:

```bash
npm install
```

Jalankan dev server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Deploy ke Vercel

Deploy dari repo GitHub `BatikEye`, lalu gunakan konfigurasi berikut:

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Tambahkan environment variable di Vercel:

```text
VITE_API_BASE_URL=https://domain-backend-railway-kamu
VITE_API_WITH_CREDENTIALS=false
```

Setelah Vercel memberi domain frontend, tambahkan domain tersebut ke `CORS_ORIGINS` di Railway backend.

## Routing

File `vercel.json` sudah mengatur rewrite semua route ke `index.html`, sehingga route React seperti `/login`, `/gallery`, `/upload`, dan `/history` tetap aman saat browser di-refresh.
