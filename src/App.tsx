import React, { useState, useEffect } from 'react';
import { PasswordGate } from './components/PasswordGate';
import { TopNavbar } from './components/TopNavbar';
import { BirthdayHero } from './components/BirthdayHero';
import { LetterSection } from './components/LetterSection';
import { InteractiveCake } from './components/InteractiveCake';
import { PolaroidGallery } from './components/PolaroidGallery';
import { ResponseForm } from './components/ResponseForm';
import { AdminCMSModal } from './components/AdminCMSModal';
import { soundPlayer } from './utils/sound';
import type { BirthdayContent } from './types';
import { Shield, Sparkles, Heart, Save, CheckCircle2, Edit3, X, Sliders } from 'lucide-react';

const defaultFallbackContent: BirthdayContent = {
  recipientName: 'DANIEL RIVALDI',
  nickname: 'DANIEL',
  birthDate: '03 NOVEMBER 2026',
  ageText: 'Ke-16',
  heroTitle: 'Selamat Ulang Tahun, Kacung Terbaikku! ✨',
  greetingMessage:
    'Selamat bertambah usia! Terima kasih sudah selalu menjadi kacung yang paling menyenangkan, tempat bertukar cerita seru, dan selalu ada dalam setiap canda maupun duka. Semoga di umur yang baru ini, setiap impianmu dipermudah, senyummu selalu bersinar, dan persahabatan kita tetap awet sampai tua nanti! 🎉🎂',
  wishesList: [
    'Semoga selalu diberi kesehatan, kebahagiaan, dan kedamaian hati 🌸',
    'Semoga impian dan cita-cita besarmu tercapai satu per satu ✨',
    'Tetaplah menjadi pribadi yang hangat dan ceria seperti sekarang 💖',
    'Semoga kita bisa terus jalan-jalan, kulineran, dan ciptakan memori baru bareng! ☕',
    'Semoga ga botfrag lagi'
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
  secretLetter: 'Pesan Rahasia Tambahan: Hbd daniel bujang',
  sectionTexts: {
    heroSubtitle:
      'Hari ini didedikasikan penuh untuk merayakan senyummu, kebaikanmu, dan segala cerita hebat yang telah kita lewati bersama. Semoga tahun ini membawa berkah luar biasa!',
    heroConfettiBtn: 'Rayakan dengan Konfeti!',
    heroCakeBtn: 'Tiup Lilin Kue',
    letterKicker: 'Dari Hati yang Paling Tulus',
    letterBadge: 'Spesial Hari Ulang Tahun',
    letterSignature: '— Dengan penuh kasih & doa, Sahabatmu ✨',
    wishesHeader: 'Untaian Doa & Harapan Terbaik:',
    cakeBadge: 'Momen Tiup Lilin Virtual',
    cakeTitle: 'Pejamkan Mata, Ucapkan Doa, & Tiup Lilinnya!',
    cakeSubtitle:
      'Sebelum meniup, pikirkan satu impian terbesar yang ingin kamu wujudkan di umur barumu ini.',
    cakeBlowBtn: 'Tiup Lilin Sekarang! 💨',
    cakeSuccessText: 'Lilin Telah Ditiup! Semoga Harapanmu Segera Terkabul ✨',
    galleryBadge: 'Galeri Memori',
    galleryTitle: 'Momen-Momen Manis Bersama',
    gallerySubtitle:
      'Setiap tawa dan kenangan yang terabadikan menjadi bukti indahnya persahabatan kita.',
    responseBadge: 'Kirim Balasan Langsung',
    responseTitle: 'Tulis Balasan atau Harapanmu untuk Davio',
    responseSubtitle:
      'Pesan yang kamu tulis di formulir ini akan langsung terkirim otomatis ke email pemilik.',
    responseSubmitBtn: 'Kirim Balasan Langsung ke Email Davio 💌',
    footerText: 'Dibuat dengan penuh kasih khusus untukmu',
    footerSubtext: 'Pesan balasan langsung terhubung ke email pemilik.'
  }
};

export default function App() {
  const [content, setContent] = useState<BirthdayContent>(defaultFallbackContent);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState(false);
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load content from backend
  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setContent((prev) => ({
            ...prev,
            ...data.data,
            sectionTexts: {
              ...prev.sectionTexts,
              ...data.data.sectionTexts
            }
          }));
        }
      }
    } catch (err) {
      console.warn('Using local fallback content:', err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleToggleMelody = () => {
    const nextState = soundPlayer.toggleMelody();
    setIsMelodyPlaying(nextState);
  };

  const handleUpdateContent = (updated: Partial<BirthdayContent>) => {
    setContent((prev) => ({
      ...prev,
      ...updated,
      sectionTexts: {
        ...prev.sectionTexts,
        ...updated.sectionTexts
      }
    }));
  };

  const handleSaveVisualEdits = async () => {
    setSaveStatus('Menyimpan...');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: content.adminPin || '1708',
          content: content
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus('Tersimpan! ✨');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus(data.message || 'Gagal menyimpan');
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch {
      setSaveStatus('Error koneksi');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 selection:bg-rose-100 selection:text-rose-700 font-sans antialiased">
      {/* Floating Visual Edit Mode Action Bar */}
      {isVisualEditMode && isUnlocked && (
        <div className="sticky top-0 z-50 bg-amber-500 text-slate-900 px-4 py-2.5 shadow-lg border-b border-amber-600 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span>Mode Edit Langsung Aktif: Kamu bisa mengedit atau menghapus teks apa pun di halaman!</span>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="text-xs bg-white/90 px-2.5 py-1 rounded-md font-bold text-slate-800 shadow-xs">
                {saveStatus}
              </span>
            )}
            <button
              onClick={handleSaveVisualEdits}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan Perubahan</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Panel CMS</span>
            </button>
            <button
              onClick={() => setIsVisualEditMode(false)}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              title="Tutup Mode Edit"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Password Gate if not unlocked */}
      {!isUnlocked ? (
        <PasswordGate
          onUnlockSuccess={() => {
            setIsUnlocked(true);
            setIsMelodyPlaying(true);
          }}
          onOpenAdminModal={() => setIsAdminOpen(true)}
        />
      ) : (
        /* Full Birthday Celebration Web Page */
        <div className="flex flex-col min-h-screen">
          {/* Top Navbar */}
          <TopNavbar
            recipientNickname={content.nickname || content.recipientName}
            isMelodyPlaying={isMelodyPlaying}
            onToggleMelody={handleToggleMelody}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* Main Celebration Content */}
          <main className="flex-1">
            <BirthdayHero
              content={content}
              isEditMode={isVisualEditMode}
              onUpdateContent={handleUpdateContent}
            />
            <LetterSection
              content={content}
              isEditMode={isVisualEditMode}
              onUpdateContent={handleUpdateContent}
            />
            <InteractiveCake
              content={content}
              isEditMode={isVisualEditMode}
              onUpdateContent={handleUpdateContent}
            />
            <PolaroidGallery
              content={content}
              isEditMode={isVisualEditMode}
              onUpdateContent={handleUpdateContent}
              onOpenAdminModal={() => setIsAdminOpen(true)}
            />
            <ResponseForm
              content={content}
              isEditMode={isVisualEditMode}
              onUpdateContent={handleUpdateContent}
            />
          </main>

          {/* Celebration Footer */}
          <footer className="py-12 border-t border-[#eee5d8] bg-[#fbf9f4] text-center text-xs text-slate-500">
            <div className="max-w-4xl mx-auto px-4 space-y-3">
              {/* Footer main text */}
              {(content.sectionTexts?.footerText || isVisualEditMode) && (
                <div>
                  {isVisualEditMode ? (
                    <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                      <input
                        type="text"
                        value={content.sectionTexts?.footerText || ''}
                        onChange={(e) =>
                          handleUpdateContent({
                            sectionTexts: {
                              ...content.sectionTexts,
                              footerText: e.target.value
                            }
                          })
                        }
                        placeholder="Teks footer..."
                        className="text-xs px-2 py-1 border border-slate-300 rounded w-full text-center"
                      />
                    </div>
                  ) : (
                    content.sectionTexts?.footerText && (
                      <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold text-sm">
                        <span>{content.sectionTexts.footerText}</span>
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        <span>({content.recipientName})</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Footer subtext */}
              {(content.sectionTexts?.footerSubtext || isVisualEditMode) && (
                <div>
                  {isVisualEditMode ? (
                    <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                      <input
                        type="text"
                        value={content.sectionTexts?.footerSubtext || ''}
                        onChange={(e) =>
                          handleUpdateContent({
                            sectionTexts: {
                              ...content.sectionTexts,
                              footerSubtext: e.target.value
                            }
                          })
                        }
                        placeholder="Subtext footer..."
                        className="text-xs px-2 py-1 border border-slate-300 rounded w-full text-center"
                      />
                    </div>
                  ) : (
                    content.sectionTexts?.footerSubtext && (
                      <p className="text-slate-400">
                        {content.sectionTexts.footerSubtext} ({content.notificationEmail})
                      </p>
                    )
                  )}
                </div>
              )}

              {/* Mode Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsVisualEditMode(!isVisualEditMode)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isVisualEditMode
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isVisualEditMode ? 'Keluar Mode Edit Langsung' : 'Mode Edit Langsung di Halaman'}</span>
                </button>

                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors cursor-pointer text-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pengaturan Editor (Mode Pemilik)</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Admin CMS Modal */}
      <AdminCMSModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onContentUpdated={(newContent) => {
          setContent(newContent);
          setIsUnlocked(true);
        }}
        onToggleVisualEditMode={() => {
          setIsVisualEditMode(true);
          setIsUnlocked(true);
        }}
        isVisualEditMode={isVisualEditMode}
      />
    </div>
  );
}
