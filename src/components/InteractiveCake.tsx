import React, { useState } from 'react';
import { Sparkles, Flame, Wind, Heart, MailOpen, RotateCcw, Trash2 } from 'lucide-react';
import { fireCelebrationConfetti, fireSideCannons } from '../utils/confetti';
import { soundPlayer } from '../utils/sound';
import type { BirthdayContent } from '../types';

interface InteractiveCakeProps {
  content: BirthdayContent;
  isEditMode?: boolean;
  onUpdateContent?: (updated: Partial<BirthdayContent>) => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({
  content,
  isEditMode,
  onUpdateContent
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [showSecretLetter, setShowSecretLetter] = useState(false);

  const texts = content.sectionTexts || {};
  const badge = texts.cakeBadge !== undefined ? texts.cakeBadge : 'Momen Tiup Lilin Virtual';
  const title =
    texts.cakeTitle !== undefined ? texts.cakeTitle : 'Pejamkan Mata, Ucapkan Doa, & Tiup Lilinnya!';
  const subtitle =
    texts.cakeSubtitle !== undefined
      ? texts.cakeSubtitle
      : 'Sebelum meniup, pikirkan satu impian terbesar yang ingin kamu wujudkan di umur barumu ini.';
  const blowBtn = texts.cakeBlowBtn || 'Tiup Lilin Sekarang! 💨';
  const successText =
    texts.cakeSuccessText || 'Lilin Telah Ditiup! Semoga Harapanmu Segera Terkabul ✨';

  const updateSectionText = (key: string, value: string) => {
    if (!onUpdateContent) return;
    onUpdateContent({
      sectionTexts: {
        ...content.sectionTexts,
        [key]: value
      }
    });
  };

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setIsBlowing(true);
    soundPlayer.playBlowCandleSound();

    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
      fireCelebrationConfetti();
      fireSideCannons();
    }, 600);
  };

  const handleRelight = () => {
    setCandlesLit(true);
    soundPlayer.playCelebrationChime();
  };

  const recipientNickname = content.nickname || content.recipientName || 'Kawan';

  return (
    <section id="cake" className="py-16 px-4 sm:px-6 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          {(badge || isEditMode) && (
            <div className="inline-block mb-3">
              {isEditMode ? (
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 p-1 rounded-lg">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => updateSectionText('cakeBadge', e.target.value)}
                    placeholder="Badge lilin..."
                    className="text-xs bg-white border border-amber-300 rounded px-2 py-0.5 w-44 text-center font-bold"
                  />
                  <button
                    onClick={() => updateSectionText('cakeBadge', '')}
                    className="text-amber-700 hover:text-rose-600 p-0.5"
                    title="Hapus badge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                badge && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-md">
                    {badge}
                  </span>
                )
              )}
            </div>
          )}

          {/* Title */}
          {(title || isEditMode) && (
            <div className="mb-2">
              {isEditMode ? (
                <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => updateSectionText('cakeTitle', e.target.value)}
                    placeholder="Judul bagian lilin..."
                    className="text-2xl font-bold text-center border border-slate-300 rounded-lg p-2 w-full"
                  />
                  <button
                    onClick={() => updateSectionText('cakeTitle', '')}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Hapus judul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                title && (
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
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
                <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
                  <textarea
                    rows={2}
                    value={subtitle}
                    onChange={(e) => updateSectionText('cakeSubtitle', e.target.value)}
                    placeholder="Subtitle lilin..."
                    className="text-xs text-center border border-slate-300 rounded-lg p-2 w-full"
                  />
                  <button
                    onClick={() => updateSectionText('cakeSubtitle', '')}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Hapus subtitle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                subtitle && (
                  <p className="text-sm text-slate-500 max-w-lg mx-auto">
                    {subtitle}
                  </p>
                )
              )}
            </div>
          )}
        </div>

        {/* Cake Container Box */}
        <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden text-center">
          {candlesLit && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-300/25 rounded-full blur-3xl pointer-events-none transition-opacity duration-700" />
          )}

          {/* Interactive Cake Illustration / Stage */}
          <div className="relative inline-flex flex-col items-center justify-center my-4">
            {/* Candle Flames */}
            <div className="flex items-end justify-center gap-6 sm:gap-8 mb-1">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  {candlesLit ? (
                    <div
                      className={`w-4 h-6 sm:w-5 sm:h-7 rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-yellow-100 shadow-[0_0_20px_#f59e0b] ${
                        isBlowing ? 'scale-50 opacity-40 transition-all' : 'animate-flicker'
                      }`}
                      style={{ animationDelay: `${idx * 0.2}s` }}
                    />
                  ) : (
                    <div className="h-6 flex flex-col items-center justify-center animate-smoke">
                      <div className="w-2 h-2 rounded-full bg-slate-300/80 blur-xs" />
                      <div className="w-1.5 h-3 rounded-full bg-slate-400/50 blur-xs mt-1" />
                    </div>
                  )}

                  <div className="w-0.5 h-2 bg-slate-700" />
                  <div
                    className={`w-3.5 sm:w-4 h-12 sm:h-16 rounded-t-sm shadow-xs ${
                      idx === 1
                        ? 'bg-gradient-to-b from-rose-300 to-rose-400'
                        : 'bg-gradient-to-b from-amber-200 to-amber-300'
                    }`}
                  >
                    <div className="w-full h-1 bg-white/40 my-2" />
                    <div className="w-full h-1 bg-white/40 my-2" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Tiers */}
            <div className="relative">
              <div className="w-48 sm:w-60 h-16 sm:h-20 bg-gradient-to-b from-rose-100 via-rose-50 to-[#fdf2f4] rounded-2xl mx-auto border border-rose-200/80 relative shadow-sm flex items-center justify-center">
                <div className="absolute -top-1 inset-x-2 flex justify-around">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-3 bg-white rounded-b-full shadow-xs border-b border-rose-200/50"
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <span className="text-xl">🍓</span>
                  <span className="text-xl">✨</span>
                  <span className="text-xl">🍓</span>
                </div>
              </div>

              <div className="w-64 sm:w-80 h-20 sm:h-24 bg-gradient-to-b from-amber-50 via-white to-amber-100/50 rounded-2xl -mt-2 mx-auto border border-amber-200/80 relative shadow-md flex items-center justify-center">
                <span className="text-sm sm:text-base font-extrabold text-slate-700 tracking-wide">
                  HAPPY BIRTHDAY {recipientNickname.trim().toUpperCase()}
                </span>
                <div className="absolute bottom-1 inset-x-4 flex justify-between px-2 text-rose-300 text-xs">
                  {[...Array(9)].map((_, i) => (
                    <span key={i}>•</span>
                  ))}
                </div>
              </div>

              <div className="w-72 sm:w-96 h-4 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-full mx-auto -mt-1 shadow-sm border border-slate-300/80" />
              <div className="w-28 sm:w-36 h-4 bg-slate-200 rounded-b-xl mx-auto border-x border-b border-slate-300/70" />
            </div>
          </div>

          {/* Status & Control Buttons */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {candlesLit ? (
              <button
                onClick={handleBlowCandles}
                disabled={isBlowing}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <Wind className="w-5 h-5 animate-pulse" />
                <span>{blowBtn}</span>
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{successText}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {content.secretLetter && (
                    <button
                      onClick={() => setShowSecretLetter(!showSecretLetter)}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <MailOpen className="w-4 h-4" />
                      <span>{showSecretLetter ? 'Tutup Catatan Rahasia' : 'Buka Catatan Rahasia'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleRelight}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Nyalakan Lilin Lagi</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Secret Note Modal / Card Reveal */}
          {(showSecretLetter || isEditMode) && (
            <div className="mt-8 p-6 bg-[#fffaf5] border border-amber-200 rounded-2xl text-left max-w-xl mx-auto shadow-sm relative">
              <div className="flex items-center justify-between mb-3 text-rose-600 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span>Catatan Rahasia dari Pemilik Web</span>
                </div>
                {isEditMode && (
                  <button
                    onClick={() => onUpdateContent?.({ secretLetter: '' })}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-normal"
                    title="Hapus catatan rahasia ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus Catatan
                  </button>
                )}
              </div>

              {isEditMode ? (
                <textarea
                  rows={4}
                  value={content.secretLetter || ''}
                  onChange={(e) => onUpdateContent?.({ secretLetter: e.target.value })}
                  placeholder="Ketik catatan rahasia di sini atau kosongkan untuk menghapus..."
                  className="w-full p-3 border border-amber-300 rounded-xl text-sm"
                />
              ) : (
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-handwriting text-lg">
                  {content.secretLetter}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
