import React from 'react';
import { Heart, Sparkles, Trash2, Plus } from 'lucide-react';
import type { BirthdayContent } from '../types';

interface LetterSectionProps {
  content: BirthdayContent;
  isEditMode?: boolean;
  onUpdateContent?: (updated: Partial<BirthdayContent>) => void;
}

export const LetterSection: React.FC<LetterSectionProps> = ({
  content,
  isEditMode,
  onUpdateContent
}) => {
  const texts = content.sectionTexts || {};
  const kicker = texts.letterKicker !== undefined ? texts.letterKicker : 'Dari Hati yang Paling Tulus';
  const badge = texts.letterBadge !== undefined ? texts.letterBadge : 'Spesial Hari Ulang Tahun';
  const signature =
    texts.letterSignature !== undefined ? texts.letterSignature : '— Dengan penuh kasih & doa, Sahabatmu ✨';
  const wishesHeader =
    texts.wishesHeader !== undefined ? texts.wishesHeader : 'Untaian Doa & Harapan Terbaik:';

  const updateSectionText = (key: string, value: string) => {
    if (!onUpdateContent) return;
    onUpdateContent({
      sectionTexts: {
        ...content.sectionTexts,
        [key]: value
      }
    });
  };

  const handleUpdateWish = (idx: number, text: string) => {
    if (!onUpdateContent) return;
    const updated = [...content.wishesList];
    updated[idx] = text;
    onUpdateContent({ wishesList: updated });
  };

  const handleDeleteWish = (idx: number) => {
    if (!onUpdateContent) return;
    const updated = content.wishesList.filter((_, i) => i !== idx);
    onUpdateContent({ wishesList: updated });
  };

  const handleAddWish = () => {
    if (!onUpdateContent) return;
    onUpdateContent({
      wishesList: [...content.wishesList, 'Semoga senantiasa dilimpahi berkah dan kebahagiaan 🌟']
    });
  };

  return (
    <section id="greeting" className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Letter Card */}
        <div className="bg-[#fffefb] border border-[#e8dfd2] rounded-3xl p-6 sm:p-12 shadow-sm relative">
          {/* Decorative Corner Stamp */}
          {(badge || isEditMode) && (
            <div className="absolute top-6 right-6 flex items-center gap-1.5">
              {isEditMode ? (
                <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => updateSectionText('letterBadge', e.target.value)}
                    placeholder="Badge..."
                    className="text-xs bg-white border border-rose-300 rounded px-2 py-0.5 w-36"
                  />
                  <button
                    onClick={() => updateSectionText('letterBadge', '')}
                    className="text-rose-500 hover:text-rose-700 p-0.5"
                    title="Hapus badge ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                badge && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{badge}</span>
                  </div>
                )
              )}
            </div>
          )}

          <div className="max-w-2xl">
            {/* Kicker label */}
            {(kicker || isEditMode) && (
              <div className="mb-2">
                {isEditMode ? (
                  <div className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      value={kicker}
                      onChange={(e) => updateSectionText('letterKicker', e.target.value)}
                      placeholder="Label atas surat..."
                      className="text-xs font-bold uppercase tracking-widest bg-slate-50 border border-slate-300 rounded px-2 py-1 w-64"
                    />
                    <button
                      onClick={() => updateSectionText('letterKicker', '')}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Hapus label atas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  kicker && (
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                      {kicker}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Letter Title */}
            <div className="mb-6">
              {isEditMode ? (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Judul Ucapan:</span>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={(e) => onUpdateContent?.({ heroTitle: e.target.value })}
                    className="w-full text-xl font-bold text-slate-800 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              ) : (
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                  {content.heroTitle}
                </h2>
              )}
            </div>

            {/* Greeting Letter Body */}
            <div className="space-y-4 text-slate-700 leading-relaxed text-base sm:text-lg">
              {isEditMode ? (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Isi Surat Ucapan:</span>
                  <textarea
                    rows={6}
                    value={content.greetingMessage}
                    onChange={(e) => onUpdateContent?.({ greetingMessage: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm leading-relaxed"
                  />
                </div>
              ) : (
                <p className="whitespace-pre-line">{content.greetingMessage}</p>
              )}
            </div>

            {/* Signature */}
            {(signature || isEditMode) && (
              <div className="mt-6 pt-4 border-t border-[#f0e9dd]">
                {isEditMode ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Tanda Tangan:</span>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => updateSectionText('letterSignature', e.target.value)}
                      placeholder="Tanda tangan..."
                      className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded-lg"
                    />
                    <button
                      onClick={() => updateSectionText('letterSignature', '')}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Hapus tanda tangan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  signature && (
                    <span className="font-handwriting text-2xl text-rose-600">
                      {signature}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Wishes Cards Grid */}
          <div className="mt-12 pt-8 border-t border-[#ede5d8]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {isEditMode ? (
                  <input
                    type="text"
                    value={wishesHeader}
                    onChange={(e) => updateSectionText('wishesHeader', e.target.value)}
                    className="font-bold text-slate-800 border border-slate-300 rounded px-2 py-1 text-sm"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-slate-800">
                    {wishesHeader}
                  </h3>
                )}
              </div>

              {isEditMode && (
                <button
                  onClick={handleAddWish}
                  className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-amber-100"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Doa
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.wishesList.map((wish, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#faf6ee] border border-[#eee5d8] hover:border-rose-200 transition-colors flex items-start gap-3 relative group"
                >
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>

                  {isEditMode ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={wish}
                        onChange={(e) => handleUpdateWish(idx, e.target.value)}
                        className="flex-1 text-xs bg-white border border-slate-300 rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleDeleteWish(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Hapus doa ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {wish}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
