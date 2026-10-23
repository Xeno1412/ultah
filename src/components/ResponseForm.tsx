import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle2, Heart, Mail, Trash2 } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { soundPlayer } from '../utils/sound';
import type { BirthdayContent } from '../types';

interface ResponseFormProps {
  content: BirthdayContent;
  isEditMode?: boolean;
  onUpdateContent?: (updated: Partial<BirthdayContent>) => void;
}

export const ResponseForm: React.FC<ResponseFormProps> = ({
  content,
  isEditMode,
  onUpdateContent
}) => {
  const recipientNickname = content.nickname || content.recipientName || 'Kawan';
  const targetEmail = content.notificationEmail || 'davio.herva17@smk.belajar.id';

  const [senderName, setSenderName] = useState(recipientNickname);
  const [reactionEmoji, setReactionEmoji] = useState('🥰');
  const [message, setMessage] = useState('');
  const [favoriteMemory, setFavoriteMemory] = useState('');
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const texts = content.sectionTexts || {};
  const badge = texts.responseBadge !== undefined ? texts.responseBadge : 'Kirim Balasan Langsung';
  const title =
    texts.responseTitle !== undefined
      ? texts.responseTitle
      : `Tulis Balasan atau Harapanmu untuk Davio`;
  const subtitle =
    texts.responseSubtitle !== undefined
      ? texts.responseSubtitle
      : `Pesan yang kamu tulis di formulir ini akan langsung terkirim otomatis ke email pemilik (${targetEmail}).`;
  const submitBtn =
    texts.responseSubmitBtn || 'Kirim Balasan Langsung ke Email Davio 💌';

  const updateSectionText = (key: string, value: string) => {
    if (!onUpdateContent) return;
    onUpdateContent({
      sectionTexts: {
        ...content.sectionTexts,
        [key]: value
      }
    });
  };

  const emojiOptions = [
    { emoji: '🥰', label: 'Terharu' },
    { emoji: '🎉', label: 'Hepi Banget' },
    { emoji: '💖', label: 'Makasih Banyak' },
    { emoji: '🥹', label: 'Nangis Haru' },
    { emoji: '🥳', label: 'Gas Rayain' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorStatus('Mohon tuliskan pesan balasanmu ya!');
      return;
    }

    setLoading(true);
    setErrorStatus(null);

    try {
      const res = await fetch('/api/send-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          reactionEmoji,
          message,
          favoriteMemory
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessStatus(data.message || 'Pesan balasan berhasil terkirim ke email Davio!');
        fireCelebrationConfetti();
        soundPlayer.playCelebrationChime();
        setMessage('');
        setFavoriteMemory('');
      } else {
        setErrorStatus(data.message || 'Gagal mengirim pesan. Coba lagi ya.');
      }
    } catch {
      setErrorStatus('Koneksi terganggu. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="response" className="py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-[#e8dfd2] rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
          {/* Top highlight ribbon */}
          {(badge || isEditMode) && (
            <div className="flex items-center gap-2 mb-4">
              {isEditMode ? (
                <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => updateSectionText('responseBadge', e.target.value)}
                    placeholder="Badge balasan..."
                    className="text-xs bg-white border border-rose-300 rounded px-2 py-0.5 w-44 font-bold"
                  />
                  <button
                    onClick={() => updateSectionText('responseBadge', '')}
                    className="text-rose-600 hover:text-rose-700 p-0.5"
                    title="Hapus badge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                badge && (
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200/80 px-3 py-1 rounded-md">
                    {badge}
                  </span>
                )
              )}

              <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Terkirim langsung ke: <strong className="text-slate-600 font-mono">{targetEmail}</strong>
              </span>
            </div>
          )}

          {/* Title */}
          {(title || isEditMode) && (
            <div className="mb-2">
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => updateSectionText('responseTitle', e.target.value)}
                    placeholder="Judul bagian balasan..."
                    className="text-xl font-bold border border-slate-300 rounded-lg p-2 w-full"
                  />
                  <button
                    onClick={() => updateSectionText('responseTitle', '')}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Hapus judul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                title && (
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                    {title}
                  </h2>
                )
              )}
            </div>
          )}

          {/* Subtitle */}
          {(subtitle || isEditMode) && (
            <div className="mt-2">
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    value={subtitle}
                    onChange={(e) => updateSectionText('responseSubtitle', e.target.value)}
                    placeholder="Subtitle balasan..."
                    className="text-xs border border-slate-300 rounded-lg p-2 w-full"
                  />
                  <button
                    onClick={() => updateSectionText('responseSubtitle', '')}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Hapus subtitle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                subtitle && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {subtitle}
                  </p>
                )
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Reaction Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Perasaan / Reaksimu:
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {emojiOptions.map((opt) => (
                  <button
                    key={opt.emoji}
                    type="button"
                    onClick={() => setReactionEmoji(opt.emoji)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      reactionEmoji === opt.emoji
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs ring-2 ring-rose-200'
                        : 'bg-[#faf7f2] border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Pengirim:
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-[#faf8f4] border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pesan Balasan &amp; Harapan: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errorStatus) setErrorStatus(null);
                }}
                required
                placeholder="Tuliskan ucapan terima kasih, doa balasan, atau pesan lucumu di sini..."
                className="w-full px-4 py-3 bg-[#faf8f4] border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Favorite Memory (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kenangan Paling Berkesan Bersama Davio: (Opsional)
              </label>
              <input
                type="text"
                value={favoriteMemory}
                onChange={(e) => setFavoriteMemory(e.target.value)}
                placeholder="Contoh: Waktu kita kejebak hujan bareng setelah ujian..."
                className="w-full px-4 py-2.5 bg-[#faf8f4] border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Status alerts */}
            {errorStatus && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorStatus}</span>
              </div>
            )}

            {successStatus && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm font-medium text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{successStatus}</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    Email notifikasi telah dialirkan ke <strong className="underline">{targetEmail}</strong> dan tersimpan aman di Inbox Pemilik.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={submitBtn}
                  onChange={(e) => updateSectionText('responseSubmitBtn', e.target.value)}
                  className="w-full py-2.5 px-3 border border-rose-300 rounded-xl text-xs font-bold"
                />
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-xl shadow-lg shadow-rose-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-200" />
                    <span>{submitBtn}</span>
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
