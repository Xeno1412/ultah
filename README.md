# 🎂 Web Ucapan Ulang Tahun Interaktif

Web perayaan ulang tahun digital personal dengan proteksi kata sandi, kue tiup lilin virtual, galeri kenangan polaroid, editor konten visual mandiri, dan pengiriman pesan balasan ke email pemilik.

Sekarang web bisa dijalankan **di XAMPP** (Apache + PHP) dan dibagikan lewat **Cloudflare Tunnel**.

---

## ⚡ Cara paling gampang (Windows)

Double-click **`start-xampp.bat`** dari folder proyek. Script akan otomatis:

- menyalin paket build dari `xampp/birthday` ke `C:\xampp\htdocs\birthday`,
- memindahkan folder lama ke `birthday-backup-...` kalau isinya bukan paket build yang benar,
- menyalakan Apache XAMPP,
- membuka `http://localhost/birthday/`,
- menawarkan untuk langsung membuka Cloudflare Tunnel.

Syarat: paket build sudah ada. Kalau belum:

```bash
npm install
npm run build:xampp
```

Kalau XAMPP tidak terpasang di `C:\xampp`, edit baris ini di bagian atas `start-xampp.bat`:

```bat
set "XAMPP_DIR=C:\xampp"
```

Untuk hanya menyiapkan folder tanpa menyalakan Apache:

```bat
start-xampp.bat --install-only
```

Kalau paket sudah terpasang, script tidak menimpa folder `data`, jadi konten dan pesan masuk tetap aman. Untuk memperbarui kode, rename dulu folder `htdocs\birthday` lalu jalankan script lagi.

---

## 🚀 Menjalankan di XAMPP secara manual

### 1. Build paket XAMPP (butuh Node.js, sekali saja)

Install [Node.js](https://nodejs.org/) versi 20 atau lebih baru, lalu buka Command Prompt di folder proyek:

```bash
npm install
npm run build:xampp
```

Hasilnya ada di folder **`xampp/birthday/`** yang sudah berisi:

- `index.html` + `assets/` (hasil build React)
- `api/` (API PHP pengganti server Express)
- `data/` (konten dan inbox)
- `.htaccess` (routing API + proteksi folder data)

Node.js **tidak diperlukan** saat web sudah jalan di XAMPP. Node hanya dipakai untuk build.

### 2. Copy ke htdocs

Copy **isi** folder `xampp/birthday/` ke:

```
C:\xampp\htdocs\birthday\
```

Pastikan path file jadi `C:\xampp\htdocs\birthday\index.html`, bukan `...\birthday\birthday\index.html`.

### 3. Nyalakan Apache

1. Buka **XAMPP Control Panel**.
2. Klik **Start** pada **Apache**. MySQL tidak perlu dinyalakan.
3. Buka browser ke:

```
http://localhost/birthday/
```

Kalau Apache gagal start karena port 80 dipakai (biasanya IIS atau Skype), ubah port Apache di XAMPP atau hentikan aplikasi tersebut.

### 4. Kalau ingin diakses dari root

Isi `xampp/birthday/` juga boleh dicopy langsung ke `C:\xampp\htdocs\`. Semua path aset sudah relatif, jadi web tetap jalan di `http://localhost/`. Kalau memilih cara ini, gunakan path `/` pada saat membuka link tunnel.

### Catatan XAMPP

- **mod_rewrite** dan **AllowOverride All** harus aktif agar endpoint seperti `api/content` bisa diakses. Di XAMPP bawaan keduanya sudah aktif. Kalau tidak, frontend otomatis mencoba `api/content.php` sebagai cadangan.
- Folder `data/` **sengaja diblokir** dari akses browser lewat `.htaccess`, karena berisi PIN admin dan kata sandi. PHP tetap bisa membacanya.
- Di Linux, beri izin tulis ke folder data agar konten bisa disimpan:
  ```bash
  chmod -R 775 data
  ```

---

## 🌐 Cloudflare Tunnel

### Cara cepat (tanpa domain sendiri)

1. Install `cloudflared`:

   ```bat
   winget install --id Cloudflare.cloudflared
   ```

   Atau download dari [halaman resmi Cloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).

2. Pastikan **Apache XAMPP sudah berjalan**.

3. Double-click **`xampp/start-cloudflare-tunnel.bat`** (tersedia juga di root proyek).

4. Tunggu sampai muncul URL seperti:

   ```
   https://nama-acak.trycloudflare.com
   ```

5. Link yang dibagikan ke teman adalah URL tersebut **ditambah path situs**:

   ```
   https://nama-acak.trycloudflare.com/birthday/
   ```

   Skrip sudah menampilkan pengingat ini. Kalau situs dipasang di root htdocs, gunakan `https://nama-acak.trycloudflare.com/`.

6. Biarkan jendela Command Prompt tetap terbuka selama web dipakai. Tekan **Ctrl+C** untuk menghentikan tunnel.

**Karakteristik quick tunnel:**

- URL berubah setiap kali tunnel dijalankan ulang.
- Gratis dan tidak butuh akun Cloudflare.
- Cocok untuk berbagi sementara. Komputer dan Apache harus tetap menyala.
- Apache hanya mendengarkan di localhost; tunnel Cloudflare keluar dari komputer, jadi tidak perlu membuka port atau mengatur port forwarding.

### Cara permanen (domain sendiri)

Butuh domain yang DNS-nya sudah dikelola Cloudflare.

```bat
cloudflared tunnel login
cloudflared tunnel create birthday-web
cloudflared tunnel route dns birthday-web ultah.domainmu.com
cloudflared tunnel run --config cloudflared\config.yml birthday-web
```

Salin `cloudflared/config.yml.example` menjadi `cloudflared/config.yml`, lalu sesuaikan UUID tunnel dan path credentials. Contoh isinya:

```yaml
tunnel: UUID-TUNNEL-KAMU
credentials-file: C:\Users\NAMA-USER\.cloudflared\UUID-TUNNEL-KAMU.json

ingress:
  - hostname: ultah.domainmu.com
    service: http://localhost:80
  - service: http_status:404
```

Karena situs berada di subfolder, alamatnya menjadi `https://ultah.domainmu.com/birthday/`. Untuk memakai domain tanpa subfolder, copy isi `xampp/birthday/` ke root `htdocs`.

### Keamanan saat dibagikan

- Ganti **kata sandi teman** dan **PIN admin** lewat panel admin sebelum link disebar. PIN bawaan mudah ditebak.
- Folder `data/` sudah diblokir, tetapi PIN admin tetap diverifikasi oleh API. Jangan gunakan PIN pendek.
- Matikan tunnel (Ctrl+C) setelah acara selesai. URL quick tunnel tetap hidup selama proses cloudflared berjalan.

---

## ✏️ Mengubah Konten

Konten bisa diedit langsung dari web:

1. Buka **Mode Pemilik** di pojok kanan atas (atau tombol di footer), lalu masukkan PIN admin.
2. Edit nama, tanggal, isi surat, foto kenangan, doa, dan pengaturan email.
3. Klik **Simpan**. Perubahan langsung ditulis ke `data/birthday.json` di folder XAMPP.

> **Penting sebelum build ulang:** `npm run build:xampp` menyalin ulang folder `data/` dari proyek. Kalau konten dan pesan masuk sudah berubah di `htdocs/birthday/data/`, backup dulu folder itu sebelum build ulang, lalu kembalikan setelah copy.

Foto baru dari panel admin memakai URL/path. Simpan file fotonya di `htdocs/birthday/assets/` (misalnya `assets/foto-baru.jpg`) agar bisa diakses lewat web.

---

## 💌 Balasan & Email

- Balasan teman selalu disimpan di **Inbox Pemilik** (`data/responses.json`) dan bisa dilihat dari panel admin.
- Pengiriman email memakai `mail()` PHP. Di XAMPP, fungsi ini biasanya belum dikonfigurasi sehingga email tidak keluar. Pesan tetap tersimpan dan web akan menampilkan pemberitahuan bahwa email belum terkirim.
- Untuk email sungguhan, konfigurasi `sendmail_path`/SMTP di `C:\xampp\php\php.ini`, atau gunakan versi Node.js yang mendukung SMTP lewat `.env` (lihat bagian di bawah).

---

## 🔐 Akses Bawaan

- **Kata sandi teman:** `teman2026`
- **PIN admin:** `1708`

Keduanya bisa diubah dari panel admin tab **Password & Email**. Segera ubah sebelum link publik dibagikan.

---

## 💻 Menjalankan dengan Node.js (mode pengembangan)

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Untuk email via SMTP, salin `.env.example` menjadi `.env` lalu isi:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email-kamu@gmail.com
SMTP_PASS=app-password-gmail
SMTP_SECURE=false
```

Gunakan **App Password** Gmail, bukan kata sandi akun biasa.

---

## 📁 Struktur Penting

```
api/                  API PHP untuk XAMPP
data/                 birthday.json (konten) & responses.json (inbox)
public/assets/        foto kenangan
scripts/build-xampp.mjs   pembuat paket XAMPP
src/                  aplikasi React
start-xampp.bat       start XAMPP satu klik (copy + Apache + browser)
start-cloudflare-tunnel.bat   quick tunnel
cloudflared/          contoh config named tunnel
server.ts             server Express untuk mode Node.js
```

---

## 🧰 Troubleshooting

| Masalah | Solusi |
| --- | --- |
| Halaman putih / aset 404 | Pastikan isi folder ada langsung di `htdocs\birthday\` dan buka dengan trailing slash: `/birthday/`. |
| API 404 | Aktifkan `mod_rewrite` di `httpd.conf` dan pastikan `AllowOverride All`. Frontend akan mencoba file `.php` langsung jika rewrite mati. |
| Gagal simpan konten | Folder `data` harus bisa ditulis oleh Apache (Linux: `chmod -R 775 data`). |
| `403 Forbidden` saat buka `data/birthday.json` | Ini normal, folder data memang diblokir dari browser. |
| Tunnel tidak mau jalan | Pastikan `cloudflared` terpasang (`cloudflared --version`) dan Apache aktif di port 80. |
| Apache memakai port lain (mis. 8080) | Ubah `set "ORIGIN=http://localhost:80"` di `start-cloudflare-tunnel.bat` menjadi port yang dipakai, dan sesuaikan `service` pada config named tunnel. |
| URL tunnel error 404 | Tambahkan `/birthday/` di belakang URL publik. |
| Email tidak terkirim | Konfigurasi `mail()`/SMTP di `php.ini`; pesan tetap masuk ke Inbox admin. |
