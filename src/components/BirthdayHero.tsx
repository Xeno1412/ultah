import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, PartyPopper, Trash2, Edit3, Check } from 'lucide-react';
import { fireCelebrationConfetti, fireSideCannons } from '../utils/confetti';
import type { BirthdayContent } from '../types';

interface BirthdayHeroProps {
  content: BirthdayContent;
  isEditMode?: boolean;
  onUpdateContent?: (updated: Partial<BirthdayContent>) => void;
}

export const BirthdayHero: React.FC<BirthdayHeroProps> = ({
  content,
  isEditMode,
  onUpdateContent
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleTriggerConfetti = () => {
    fireCelebrationConfetti();
    fireSideCannons();
  };

  const texts = content.sectionTexts || {};
  const subtitle =
    texts.heroSubtitle !== undefined
      ? texts.heroSubtitle
      : 'Hari ini didedikasikan penuh untuk merayakan senyummu, kebaikanmu, dan segala cerita hebat yang telah kita lewati bersama. Semoga tahun ini membawa berkah luar biasa!';
  const confettiBtn = texts.heroConfettiBtn || 'Rayakan dengan Konfeti!';
  const cakeBtn = texts.heroCakeBtn || 'Tiup Lilin Kue';

  const updateSectionText = (key: string, value: string) => {
    if (!onUpdateContent) return;
    onUpdateContent({
      sectionTexts: {
        ...content.sectionTexts,
        [key]: value
      }
    });
  };

  return (
    <section id="top" className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Glow gradient backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-rose-200/30 via-amber-100/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Subtle date & age kicker */}
        {(content.birthDate || content.ageText || isEditMode) && (
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 px-3.5 py-1.5 rounded-full mb-6 shadow-xs relative group">
            <Calendar className="w-3.5 h-3.5" />
            {isEditMode ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={content.birthDate}
                  onChange={(e) => onUpdateContent?.({ birthDate: e.target.value })}
                  placeholder="Tanggal..."
                  className="bg-white px-2 py-0.5 rounded border border-rose-300 text-xs w-28 text-center"
                />
                <span className="text-rose-300">·</span>
                <input
                  type="text"
                  value={content.ageText}
                  onChange={(e) => onUpdateContent?.({ ageText: e.target.value })}
                  placeholder="Usia..."
                  className="bg-white px-2 py-0.5 rounded border border-rose-300 text-xs w-20 text-center"
                />
              </div>
            ) : (
              <>
                {content.birthDate && <span>{content.birthDate}</span>}
                {content.birthDate && content.ageText && <span className="text-rose-300">·</span>}
                {content.ageText && <span>{content.ageText}</span>}
              </>
            )}
            <span className="text-rose-300">·</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> Hari Bahagia
            </span>
          </div>
        )}

        {/* Headline */}
        <div className="relative mb-6">
          {isEditMode ? (
            <div className="p-3 bg-white/80 border-2 border-dashed border-rose-300 rounded-2xl max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold text-rose-600 block">Edit Nama &amp; Judul Sambutan:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content.recipientName}
                  onChange={(e) => onUpdateContent?.({ recipientName: e.target.value })}
                  placeholder="Nama Teman..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-lg font-bold text-slate-800"
                />
              </div>
            </div>
          ) : (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-tight sm:leading-none">
              Selamat Ulang Tahun, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500">
                {content.recipientName}
              </span>
              <span className="inline-block animate-bounce ml-2">🎂</span>
            </h1>
          )}
        </div>

        {/* Subtitle / Hero message */}
        {(subtitle || isEditMode) && (
          <div className="relative max-w-2xl mx-auto mb-8">
            {isEditMode ? (
              <div className="p-3 bg-white/80 border-2 border-dashed border-amber-300 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                  <span>Edit Subtitle Hero:</span>
                  <button
                    onClick={() => updateSectionText('heroSubtitle', '')}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    title="Hapus teks ini"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus Subtitle
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => updateSectionText('heroSubtitle', e.target.value)}
                  placeholder="Ketik teks subtitle atau kosongkan untuk menghapus..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700"
                />
              </div>
            ) : (
              subtitle && (
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  {subtitle}
                </p>
              )
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(confettiBtn || isEditMode) && (
            isEditMode ? (
              <div className="flex items-center gap-1 bg-white border border-rose-300 rounded-xl p-1 shadow-xs">
                <input
                  type="text"
                  value={confettiBtn}
                  onChange={(e) => updateSectionText('heroConfettiBtn', e.target.value)}
                  placeholder="Teks Tombol 1..."
                  className="px-2 py-1 text-xs rounded border border-slate-200 w-36"
                />
                <button
                  onClick={() => updateSectionText('heroConfettiBtn', '')}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Hapus tombol ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              confettiBtn && (
                <button
                  onClick={handleTriggerConfetti}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PartyPopper className="w-4 h-4 text-amber-200" />
                  <span>{confettiBtn}</span>
                </button>
              )
            )
          )}

          {(cakeBtn || isEditMode) && (
            isEditMode ? (
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl p-1 shadow-xs">
                <input
                  type="text"
                  value={cakeBtn}
                  onChange={(e) => updateSectionText('heroCakeBtn', e.target.value)}
                  placeholder="Teks Tombol 2..."
                  className="px-2 py-1 text-xs rounded border border-slate-200 w-36"
                />
                <button
                  onClick={() => updateSectionText('heroCakeBtn', '')}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Hapus tombol ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cakeBtn && (
                <a
                  href="#cake"
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{cakeBtn}</span>
                </a>
              )
            )
          )}
        </div>
      </div>
    </section>
  );
};
