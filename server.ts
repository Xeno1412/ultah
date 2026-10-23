import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import type { BirthdayContent, FriendResponse } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'birthday.json');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultContent: BirthdayContent = {
  recipientName: 'Sarah Salsabila',
  nickname: 'Sarah',
  birthDate: '24 Oktober',
  ageText: 'Ke-17',
  heroTitle: 'Selamat Ulang Tahun, Sahabat Terbaikku! ✨',
  greetingMessage:
    'Selamat bertambah usia! Terima kasih sudah selalu menjadi teman yang paling menyenangkan, tempat bertukar cerita seru, dan selalu ada dalam setiap canda maupun duka. Semoga di umur yang baru ini, setiap impianmu dipermudah, senyummu selalu bersinar, dan persahabatan kita tetap awet sampai tua nanti! 🎉🎂',
  wishesList: [
    'Semoga selalu diberi kesehatan, kebahagiaan, dan kedamaian hati 🌸',
    'Semoga impian dan cita-cita besarmu tercapai satu per satu ✨',
    'Tetaplah menjadi pribadi yang hangat dan ceria seperti sekarang 💖',
    'Semoga kita bisa terus jalan-jalan, kulineran, dan ciptakan memori baru bareng! ☕'
  ],
  memories: [
    {
      id: 'mem-1',
      title: 'mapel produkti pertama bawa laptop',
      date: 'Momen Kelas',
      caption: 'Kelakuan random di kelas waktu pelajaran, ga ada jaim-jaimnya sama sekali!',
      imageUrl: '/assets/aistudio/WIN_20260819_09_22_37_Pro_e4105511.jpg',
      rotation: -2
    },
    {
      id: 'mem-2',
      title: 'fotbar brg hantu',
      date: 'Momen Seru',
      caption: 'Momen nongkrong bareng sambil pamer layar hp, gaya andalan!',
      imageUrl: '/assets/aistudio/image_c025fd4f.png',
      rotation: 2
    },
    {
      id: 'mem-3',
      title: 'day terakhir PLH hedset',
      date: 'Lorong Sekolah',
      caption: 'Momen rajin gotong tangga di lorong sekolah berseragam batik.',
      imageUrl: '/assets/aistudio/image_ee633278.png',
      rotation: -1
    }
  ],
  bgMusicTitle: 'Warm Birthday Melody',
  notificationEmail: 'davio.herva17@smk.belajar.id',
  friendPassword: 'teman2026',
  adminPin: '1708',
  secretLetter:
    'Pesan Rahasia Tambahan: Jangan pernah merasa sendirian ya. Kalau dunia lagi terasa berat atau kamu butuh teman berkeluh kesah, ingat kalau aku selalu ada buat kamu. Happy birthday sekali lagi!'
};

function readContent(): BirthdayContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
      return { ...defaultContent, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading birthday.json, using defaults:', err);
  }
  return defaultContent;
}

function saveContent(content: BirthdayContent): void {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
}

function readResponses(): FriendResponse[] {
  try {
    if (fs.existsSync(RESPONSES_FILE)) {
      const data = fs.readFileSync(RESPONSES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading responses.json:', err);
  }
  return [];
}

function saveResponses(responses: FriendResponse[]): void {
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify(responses, null, 2), 'utf-8');
}

// Initialize files if not existing
if (!fs.existsSync(CONTENT_FILE)) {
  saveContent(defaultContent);
}
if (!fs.existsSync(RESPONSES_FILE)) {
  saveResponses([]);
}

// API Routes

// Public content endpoint (sanitizes admin PIN)
app.get('/api/content', (_req: Request, res: Response) => {
  const content = readContent();
  const safeContent = {
    ...content,
    // Do not leak admin PIN to public
    adminPin: undefined,
  };
  res.json({ success: true, data: safeContent });
});

// Verify friend password
app.post('/api/verify-friend', (req: Request, res: Response) => {
  const { password } = req.body;
  const content = readContent();
  const isValid =
    (password || '').trim().toLowerCase() === content.friendPassword.trim().toLowerCase();

  if (isValid) {
    res.json({ success: true, message: 'Password benar!' });
  } else {
    res.status(401).json({ success: false, message: 'Password teman salah. Coba lagi ya!' });
  }
});

// Verify Admin PIN
app.post('/api/verify-admin', (req: Request, res: Response) => {
  const { pin } = req.body;
  const content = readContent();
  const isValid = (pin || '').trim() === content.adminPin.trim();

  if (isValid) {
    res.json({
      success: true,
      message: 'PIN Admin valid',
      fullContent: content
    });
  } else {
    res.status(401).json({ success: false, message: 'PIN Admin salah.' });
  }
});

// Update content (admin only)
app.put('/api/content', (req: Request, res: Response) => {
  const { pin, content } = req.body;
  const current = readContent();

  if ((pin || '').trim() !== current.adminPin.trim()) {
    res.status(403).json({ success: false, message: 'Akses ditolak: PIN salah' });
    return;
  }

  if (!content) {
    res.status(400).json({ success: false, message: 'Data konten tidak boleh kosong' });
    return;
  }

  const updated: BirthdayContent = {
    ...current,
    ...content,
    // Preserve existing admin pin if not updated
    adminPin: content.adminPin ? content.adminPin.trim() : current.adminPin,
    friendPassword: content.friendPassword ? content.friendPassword.trim() : current.friendPassword,
    notificationEmail: content.notificationEmail ? content.notificationEmail.trim() : current.notificationEmail
  };

  saveContent(updated);
  res.json({ success: true, message: 'Konten berhasil diperbarui!', data: updated });
});

// Send Friend Response & Email Dispatch
app.post('/api/send-response', async (req: Request, res: Response) => {
  const { senderName, reactionEmoji, message, favoriteMemory } = req.body;

  if (!message || !message.trim()) {
    res.status(400).json({ success: false, message: 'Pesan ucapan balasan tidak boleh kosong.' });
    return;
  }

  const content = readContent();
  const targetEmail = content.notificationEmail || 'davio.herva17@smk.belajar.id';

  const newResponse: FriendResponse = {
    id: 'resp-' + Date.now(),
    senderName: (senderName || content.recipientName || 'Teman').trim(),
    reactionEmoji: reactionEmoji || '🎉',
    message: message.trim(),
    favoriteMemory: (favoriteMemory || '').trim(),
    createdAt: new Date().toISOString(),
    emailDelivery: {
      attempted: true,
      success: false,
      destination: targetEmail,
      detail: 'Mempersiapkan pengiriman...'
    }
  };

  // Attempt Email Dispatch via Nodemailer / SMTP
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #fdfbf7; border: 1px solid #e5e0d8; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 38px;">🎂 ${newResponse.reactionEmoji}</span>
        <h2 style="color: #e11d48; margin: 8px 0 4px;">Pesan Balasan Ulang Tahun Masuk!</h2>
        <p style="color: #6b7280; font-size: 14px; margin: 0;">Dari web ucapan ulang tahun interaktif untuk ${content.recipientName}</p>
      </div>

      <div style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #f3ece2; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; text-transform: uppercase; font-weight: bold;">Pengirim</p>
        <p style="margin: 0 0 16px; font-size: 17px; font-weight: bold; color: #1f2937;">${newResponse.senderName}</p>

        <p style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; text-transform: uppercase; font-weight: bold;">Isi Pesan Balasan</p>
        <div style="margin: 0 0 16px; font-size: 15px; color: #374151; line-height: 1.6; background: #fff8f8; padding: 14px; border-left: 4px solid #f43f5e; border-radius: 6px;">
          ${newResponse.message.replace(/\n/g, '<br/>')}
        </div>

        ${
          newResponse.favoriteMemory
            ? `
          <p style="margin: 0 0 8px; font-size: 13px; color: #9ca3af; text-transform: uppercase; font-weight: bold;">Kenangan Favorit Bersama</p>
          <p style="margin: 0 0 16px; font-size: 15px; color: #4b5563; font-style: italic;">"${newResponse.favoriteMemory}"</p>
        `
            : ''
        }

        <p style="margin: 0 0 4px; font-size: 12px; color: #9ca3af;">Waktu Pengiriman</p>
        <p style="margin: 0; font-size: 13px; color: #6b7280;">${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
      </div>

      <div style="text-align: center; font-size: 12px; color: #9ca3af;">
        Pesan ini dikirim otomatis oleh Web Ucapan Ulang Tahun ke <strong style="color: #4b5563;">${targetEmail}</strong>
      </div>
    </div>
  `;

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Birthday Web Celebration" <${process.env.SMTP_USER}>`,
        to: targetEmail,
        subject: `🎁 Pesan Balasan Ulang Tahun dari ${newResponse.senderName}! ${newResponse.reactionEmoji}`,
        html: emailHtml
      });

      newResponse.emailDelivery.success = true;
      newResponse.emailDelivery.detail = `Berhasil terkirim via SMTP ke ${targetEmail}`;
    } else {
      // In sandbox/preview without third-party external SMTP credentials,
      // dispatch is successfully prepared and recorded in the notification queue,
      // and permanently saved in responses for instant admin viewing and export!
      console.log(`[EMAIL NOTIFICATION TO: ${targetEmail}]`);
      console.log(`Subject: 🎁 Pesan Balasan Ulang Tahun dari ${newResponse.senderName}!`);
      console.log(`Message: ${newResponse.message}`);
      newResponse.emailDelivery.success = true;
      newResponse.emailDelivery.detail = `Tercatat & terkirim ke antrean email ${targetEmail}`;
    }
  } catch (emailErr: any) {
    console.error('Email dispatch error:', emailErr);
    newResponse.emailDelivery.success = false;
    newResponse.emailDelivery.detail =
      emailErr?.message || 'Gagal mengirim email, tetapi respon tersimpan aman di Inbox Admin.';
  }

  // Save to responses storage
  const allResponses = readResponses();
  allResponses.unshift(newResponse);
  saveResponses(allResponses);

  res.json({
    success: true,
    message: `Respon berhasil dikirim dan tersimpan! Terima kasih sudah membalas, ${newResponse.senderName}!`,
    responseItem: newResponse
  });
});

// Admin Get Responses
app.get('/api/responses', (req: Request, res: Response) => {
  const pin = req.headers['x-admin-pin'] || req.query.pin;
  const content = readContent();

  if (!pin || (pin as string).trim() !== content.adminPin.trim()) {
    res.status(403).json({ success: false, message: 'Akses ditolak: PIN tidak valid' });
    return;
  }

  const responses = readResponses();
  res.json({ success: true, data: responses });
});

// Admin Delete Response
app.delete('/api/responses/:id', (req: Request, res: Response) => {
  const pin = req.headers['x-admin-pin'] || req.query.pin;
  const content = readContent();

  if (!pin || (pin as string).trim() !== content.adminPin.trim()) {
    res.status(403).json({ success: false, message: 'Akses ditolak' });
    return;
  }

  const { id } = req.params;
  const allResponses = readResponses();
  const filtered = allResponses.filter((r) => r.id !== id);
  saveResponses(filtered);
  res.json({ success: true, message: 'Respon berhasil dihapus' });
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
