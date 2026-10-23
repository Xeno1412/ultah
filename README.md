# 🎂 Web Ucapan Ulang Tahun Interaktif (Replit Ready)

Web perayaan ulang tahun digital personal dengan proteksi kata sandi, kue tiup lilin virtual, galeri kenangan polaroid, editor konten visual mandiri, dan pengiriman pesan balasan langsung ke email pemilik.

---

## 🚀 Cara Menjalankan di Replit

Proyek ini sudah dilengkapi dengan konfigurasi otomatis `.replit` dan `replit.nix`.

### Langkah Cepat:
1. **Import / Upload ke Replit**:
   - Jika dari GitHub: Pilih **Import from GitHub** dan masukkan tautan repo.
   - Atau buat **Repl baru (Node.js)** lalu unggah file-file proyek ini.
2. **Jalankan Aplikasi**:
   - Klik tombol **Run** (berwarna hijau) di bagian atas Replit.
   - Replit akan otomatis menginstal dependensi (`npm install`) dan menjalankan `npm run dev`.
   - Jendela Webview (browser kecil di samping) akan otomatis terbuka dan menampilkan web ulang tahun pada port `3000`.

### Perintah Manual di Console Replit (Jika dibutuhkan):
```bash
npm install
npm run dev
```

---

## 🔐 Akses & Keamanan

- **Kata Sandi Teman (Untuk membuka kado web)**:  
  `teman2026`
- **PIN Pemilik / Admin (Untuk mengedit teks & melihat pesan masuk)**:  
  `1708`

*(Keduanya dapat Anda ubah kapan saja melalui panel admin di tab **Password & Email**)*.

---

## ✏️ Fitur Editor Konten (Mode Pemilik)

1. **Mode Edit Langsung di Halaman**:
   - Klik tombol **Mode Edit Langsung di Halaman** di footer web.
   - Anda dapat mengedit teks apa pun atau menghapusnya dengan ikon tempat sampah (🗑️) langsung pada tampilan web.
   - Klik **Simpan Perubahan** pada bilah atas untuk menyimpan secara permanen.
2. **Panel Pengelola (CMS Modal)**:
   - Klik **Mode Pemilik** di pojok kanan atas atau footer, lalu masukkan PIN `1708`.
   - Edit nama teman, tanggal lahir, isi surat ucapan, foto-foto kenangan, doa & harapan, hingga pengaturan email.
   - Semua data disimpan secara persisten di `data/birthday.json`.

---

## 💌 Respon Balasan Teman

- Teman Anda dapat menuliskan balasan dan memilih emoji reaksi di formulir bawah web.
- Pesan otomatis dialirkan ke email: **`davio.herva17@smk.belajar.id`**.
- Salinan seluruh balasan juga tersimpan di **Pesan Masuk (Inbox)** pada Panel Pemilik.
