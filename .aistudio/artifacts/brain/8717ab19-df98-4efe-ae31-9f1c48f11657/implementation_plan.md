# Web Ucapan Ulang Tahun Interaktif & Personal

Aplikasi web perayaan ulang tahun personal yang memadukan proteksi ganda (password khusus teman & PIN admin pengelola), galeri kenangan polaroid, kue ulang tahun virtual interaktif dengan tiup lilin dan konfeti, editor konten mandiri (CMS) secara real-time, serta sistem pengiriman respon balasan teman langsung ke email pemilik (`davio.herva17@smk.belajar.id`).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan jawaban klarifikasi yang telah Anda konfirmasi:
> - **Tema Visual**: Hangat, ceria, dan penuh kenangan dengan animasi konfeti yang memikat.
> - **Sistem Akses**: Password teman untuk membuka ucapan, dan PIN admin terpisah untuk masuk ke panel editor isi konten.
> - **Pengiriman Respon**: Otomatis dikirim langsung ke email pemilik melalui server backend aplikasi, disertai pencatatan di kotak masuk admin (Admin Inbox) agar tidak ada pesan yang terlewat.

- **Keputusan Akses**: Password default teman diset `teman2026` dan PIN admin diset `1708` (keduanya dapat Anda ubah kapan saja melalui panel admin).
- **Alamat Email Tujuan**: Dikonfigurasi otomatis ke `davio.herva17@smk.belajar.id`, dengan opsi untuk diperbarui langsung di pengaturan admin.
- **Dukungan Audio & Konfeti**: Musik perayaan latar akustik instrumen (dapat di-play/pause) dan efek partikel konfeti menggunakan canvas tanpa dependensi berat eksternal.

---

## 1. Overview & Core Concept

- **Apa yang Dibuat**: Web ucapan ulang tahun imersif dengan alur emosional: mulai dari gerbang login gembok rahasia, pembukaan surat/kartu ucapan animasi konfeti, pemutaran musik kenangan, tiup lilin kue ulang tahun virtual, galeri foto polaroid momen spesial, kuis tebak kenangan, dan formulir balasan yang langsung mengirimkan ucapan teman ke email Anda.
- **Target Pengguna**: Teman spesial yang sedang berulang tahun (sebagai penikmat ucapan) dan Anda sendiri (sebagai pemilik/admin yang mengisi dan mengedit konten).
- **Nilai Utama**: Menghadirkan hadiah digital yang personal, hangat, eksklusif (terproteksi kata sandi), mudah disesuaikan tanpa perlu coding ulang, dan memberikan koneksi langsung lewat notifikasi email.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Gerbang Masuk (Secret Gate)**:
   - Halaman pembuka yang elegan dengan amplop interaktif dan kolom masukan password teman.
   - Tombol rahasia di pojok ("Mode Pemilik") untuk membuka modal login PIN Admin.
2. **Pesta Pembuka (Celebration Reveal)**:
   - Setelah memasukkan password yang benar, amplop terbuka disertai letupan konfeti warna-warni dan sambutan nama teman.
   - Pemutar lagu latar akustik hangat menyala dengan kendali play/pause yang nyaman.
3. **Surat Ucapan & Kue Interaktif**:
   - Surat ucapan hangat dengan tipografi personal, tanggal lahir, dan ucapan doa.
   - Kue ulang tahun virtual 3D/vektor dengan lilin berkedip: teman bisa mengklik "Tiup Lilin" (animasi asap, tepuk tangan/cheers, dan ledakan konfeti kedua).
4. **Galeri Momen & Polaroid Timeline**:
   - Deretan kartu foto polaroid dengan pin, catatan kenangan manis, tanggal momen, dan filter foto.
5. **Formulir Balasan Teman (Send Reply)**:
   - Teman menuliskan pesan balasan, memilih emoji reaksi/perasaan, dan mengklik "Kirim Balasan ke Davio".
   - Indikator pengiriman halus dan konfirmasi sukses.
6. **Panel Editor Pemilik (Admin CMS)**:
   - Terbuka dengan PIN Admin:
     - Tab **Konten**: Ubah nama teman, panggilan, tanggal lahir, paragraf ucapan utama, dan judul.
     - Tab **Galeri Foto**: Tambah/edit/hapus foto kenangan beserta keterangannya.
     - Tab **Keamanan & Email**: Ganti password teman, PIN admin, dan alamat email tujuan penerima notifikasi.
     - Tab **Kotak Masuk**: Lihat seluruh daftar respon yang telah dikirim oleh teman lengkap dengan waktu dan isi pesan.

### Visual Identity & Theme

- **Aesthetic Direction**: Warm festive, emotional storytelling, clean editorial greeting (bebas dari kesan template kaku).
- **Color Palette**:
  - *Dominant Canvas (60%)*: Warm soft cream / ivory (`#FDFBF7`, dark: `#121214`).
  - *Structural Surfaces (30%)*: Lembut vanila hangat (`#F7F4EE`, dark: `#1C1C21`), batas halus (`#E6DFD5`).
  - *Accent Budget (10%)*: Coral rose hangat (`#E11D48` / `#F43F5E`) dan gold amber celebratory (`#F59E0B`).
- **Typography**:
  - Headings: *Plus Jakarta Sans* / *Outfit* tebal dan dinamis.
  - Body & Letters: Hangat, ramah, dan sangat nyaman dibaca.
- **Interactive Feedback**:
  - Efek tiup lilin kue interaktif dengan suara tiupan/perayaan opsional.
  - Partikel konfeti canvas yang ringan, halus, dan responsif.
  - Transisi modal dan toast notifikasi bersih.

---

## 3. Key Product Decisions & Trade-Offs

- **Autentikasi Dua Sisi (Teman vs Admin)**:
  - *Pilihan*: Password teman untuk membuka ucapan, dan PIN admin untuk masuk ke editor.
  - *Mengapa*: Menjaga kejutan bagi teman tanpa risiko teman secara tidak sengaja mengubah data ucapan, sekaligus memberi kebebasan penuh bagi Anda untuk mengedit kapan saja.
- **Penyimpanan Konten (Persistence)**:
  - *Pilihan*: Penyimpanan backend lokal terstruktur (JSON file storage pada Express backend) yang disinkronkan dengan cadangan `localStorage` browser.
  - *Mengapa*: Instan, tidak memerlukan setup akun cloud eksternal yang rumit, data langsung tersimpan saat diedit di admin, dan langsung terbaca saat link dibuka.
- **Pengiriman Respon ke Email**:
  - *Pilihan*: Endpoint backend server `/api/send-response` yang memformat email ucapan balasan berdesain cantik, dilengkapi integrasi direct SMTP / Nodemailer serta fallback webhook email service, sekaligus mencatat salinan pesan di Admin Inbox.
  - *Mengapa*: Memastikan pesan pasti sampai ke email Anda (`davio.herva17@smk.belajar.id`) dan tidak pernah hilang meskipun ada kendala kuota email.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT INTERFACE                                │
├────────────────────────┬─────────────────────────┬──────────────────────────┤
│      Guest View        │    Interactive Core     │      Admin CMS View      │
│  - Password Gate       │  - Canvas Confetti      │  - PIN Authentication    │
│  - Birthday Hero       │  - Candle Blow Physics  │  - Content Live Editor   │
│  - Heartfelt Letter    │  - Web Audio Melody     │  - Memory Photo Manager  │
│  - Polaroid Memories   │  - Response Form Modal  │  - Email Config & Inbox  │
└───────────┬────────────┴────────────┬────────────┴─────────────┬────────────┘
            │                         │                          │
            ▼                         ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API CLIENT SERVICE                                │
│                  (Fetch REST Endpoints with Fallback)                       │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND (server.ts / :3000)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  POST /api/verify-friend     -> Validasi sandi teman                        │
│  POST /api/verify-admin      -> Validasi PIN admin                          │
│  GET  /api/content           -> Ambil data ucapan, foto & pengaturan        │
│  PUT  /api/content           -> Simpan perubahan data ucapan (Owner only)   │
│  POST /api/send-response     -> Kirim respon ke email + simpan ke database  │
│  GET  /api/responses         -> Ambil riwayat respon untuk Admin Inbox      │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                 ┌────────────────────┴───────────────────┐
                 ▼                                        ▼
    ┌──────────────────────────┐             ┌─────────────────────────┐
    │  Email Dispatch Service  │             │   Persistent Storage    │
    │ (davio.herva17@smk...)   │             │   (data/birthday.json)  │
    └──────────────────────────┘             └─────────────────────────┘
```

### Data Model Schema

```typescript
interface BirthdayContent {
  recipientName: string;         // Nama teman yang berulang tahun
  nickname: string;              // Panggilan akrab
  birthDate: string;             // Tanggal ulang tahun
  ageText: string;               // e.g. "Ke-17" atau "Sweet Seventeen"
  heroTitle: string;             // Judul utama sambutan
  greetingMessage: string;       // Paragraf surat ucapan panjang
  wishesList: string[];          // Deretan doa/harapan spesial
  memories: MemoryItem[];        // Foto-foto polaroid kenangan
  musicEnabled: boolean;         // Opsi putar musik
  themeTone: 'warm' | 'pastel';  // Tone warna
  friendPasswordHash: string;    // Password teman
  adminPinHash: string;          // PIN admin
  notificationEmail: string;     // davio.herva17@smk.belajar.id
}

interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  imageUrl: string;
}

interface FriendResponse {
  id: string;
  senderName: string;
  reactionEmoji: string;
  message: string;
  favoriteMemory: string;
  submittedAt: string;
  emailStatus: 'sent' | 'pending' | 'saved';
}
```

### Verification & Testing Plan

1. **Uji Login Proteksi Sandi**: Masukkan password teman yang benar dan salah, pastikan proteksi bekerja presisi dan pesan error jelas.
2. **Uji PIN Admin & CMS**: Buka mode admin, ubah teks nama teman, foto, dan surat ucapan, lalu simpan dan pastikan tampilan teman langsung ter-update secara real-time.
3. **Uji Interaksi**: Coba efek tiup lilin kue ulang tahun, letupan konfeti, dan tombol play/pause musik perayaan.
4. **Uji Pengiriman Respon**: Isi formulir balasan teman, submit, dan pastikan respon terkirim ke backend, memicu pengiriman email, serta langsung muncul di tab Kotak Masuk Admin.
5. **Uji Responsivitas**: Tampilan rapi dan nyaman diakses baik melalui smartphone (mobile browser) maupun layar laptop/desktop.
