# AI Chat Web Application

Aplikasi web chat AI yang terhubung dengan Cursor API, dibangun menggunakan React dan Material-UI.

## 🚀 Fitur

- **Interface Chat Modern**: UI yang bersih dan responsif dengan Material-UI
- **Integrasi Cursor API**: Terhubung langsung dengan Cursor API untuk respons AI yang cerdas
- **Real-time Messaging**: Chat real-time dengan indikator typing
- **Error Handling**: Penanganan error yang komprehensif dengan pesan yang jelas
- **Mode Demo**: Fallback response ketika API belum dikonfigurasi
- **Responsive Design**: Bekerja optimal di desktop dan mobile
- **Theme Customization**: Theme Material-UI yang dapat dikustomisasi
- **Message Timestamps**: Waktu kirim pesan untuk setiap chat
- **Loading States**: Indikator loading dan typing yang smooth

## 🛠️ Teknologi yang Digunakan

- **React 17**: Library frontend utama
- **Material-UI (MUI)**: Komponen UI dan styling
- **Axios**: HTTP client untuk API calls
- **Vite**: Build tool dan development server
- **ESLint**: Code linting

## 📦 Instalasi

1. **Clone repository ini:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit file `.env` dan isi dengan API key Cursor Anda:
   ```bash
   VITE_CURSOR_API_KEY=your_actual_cursor_api_key_here
   VITE_CURSOR_API_URL=https://api.cursor.sh/v1
   VITE_CURSOR_MODEL=cursor-small
   ```

4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

5. **Buka browser dan akses:**
   ```
   http://localhost:5173
   ```

## 🔑 Mendapatkan Cursor API Key

1. Kunjungi [Cursor Settings](https://cursor.sh/settings)
2. Login ke akun Cursor Anda
3. Buat atau salin API key yang ada
4. Masukkan API key ke file `.env`

## 🎨 Kustomisasi

### Theme
Anda dapat mengkustomisasi theme di file `src/components/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    mode: 'light', // atau 'dark'
    primary: {
      main: '#2196f3', // Ubah warna primary
    },
    secondary: {
      main: '#ff9800', // Ubah warna secondary
    },
  },
});
```

### API Configuration
Konfigurasi API dapat diubah melalui environment variables:

- `VITE_CURSOR_API_KEY`: API key Cursor Anda
- `VITE_CURSOR_API_URL`: Base URL API (default: https://api.cursor.sh/v1)
- `VITE_CURSOR_MODEL`: Model yang digunakan (default: cursor-small)

## 📁 Struktur Project

```
src/
├── components/
│   ├── App.jsx          # Main app component dengan theme
│   └── ChatApp.jsx      # Komponen chat utama
├── index.jsx            # Entry point aplikasi
public/
├── vite.svg
└── ...
.env.example             # Template environment variables
.gitignore              # File yang diabaikan git
package.json            # Dependencies dan scripts
README.md               # Dokumentasi ini
vite.config.js          # Konfigurasi Vite
```

## 🚦 Scripts

- `npm run dev`: Menjalankan development server
- `npm run build`: Build aplikasi untuk production
- `npm run preview`: Preview build production
- `npm run lint`: Jalankan ESLint untuk cek kode

## 🔧 Troubleshooting

### API Key Issues
- Pastikan API key sudah benar di file `.env`
- Periksa apakah API key masih valid di Cursor settings
- Restart development server setelah mengubah `.env`

### CORS Issues
Jika mengalami masalah CORS, pastikan Cursor API mendukung CORS atau gunakan proxy.

### Build Issues
- Hapus `node_modules` dan jalankan `npm install` ulang
- Pastikan semua dependencies ter-install dengan benar

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan:

1. Buka issue di repository ini
2. Periksa dokumentasi Cursor API
3. Pastikan semua dependencies ter-install dengan benar

---

**Happy Coding! 🎉**