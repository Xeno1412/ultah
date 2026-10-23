import React, { useState } from 'react';
import { Camera, X, Calendar, ZoomIn, Trash2, Edit3, Plus, Image as ImageIcon } from 'lucide-react';
import type { BirthdayContent, MemoryItem } from '../types';

interface PolaroidGalleryProps {
  content: BirthdayContent;
  isEditMode?: boolean;
  onUpdateContent?: (updated: Partial<BirthdayContent>) => void;
  onOpenAdminModal?: () => void;
}

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({
  content,
  isEditMode,
  onUpdateContent,
  onOpenAdminModal
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);

  const texts = content.sectionTexts || {};
  const badge = texts.galleryBadge !== undefined ? texts.galleryBadge : 'Galeri Memori';
  const title = texts.galleryTitle !== undefined ? texts.galleryTitle : 'Momen-Momen Manis Bersama';
  const subtitle =
    texts.gallerySubtitle !== undefined
      ? texts.gallerySubtitle
      : 'Setiap tawa dan kenangan yang terabadikan menjadi bukti indahnya persahabatan kita.';

  const updateSectionText = (key: string, value: string) => {
    if (!onUpdateContent) return;
    onUpdateContent({
      sectionTexts: {
        ...content.sectionTexts,
        [key]: value
      }
    });
  };

  const handleUpdateMemory = (id: string, updates: Partial<MemoryItem>) => {
    if (!onUpdateContent) return;
    const updated = content.memories.map((m) => (m.id === id ? { ...m, ...updates } : m));
    onUpdateContent({ memories: updated });
  };

  const handleDeleteMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateContent) return;
    if (confirm('Hapus foto kenangan ini?')) {
      const updated = content.memories.filter((m) => m.id !== id);
      onUpdateContent({ memories: updated });
    }
  };

  return (
    <section id="memories" className="py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          {(badge || isEditMode) && (
            <div className="inline-block mb-3">
              {isEditMode ? (
                <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded-lg">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => updateSectionText('galleryBadge', e.target.value)}
                    placeholder="Badge galeri..."
                    className="text-xs bg-white border border-rose-300 rounded px-2 py-0.5 w-36 text-center font-bold"
                  />
                  <button
                    onClick={() => updateSectionText('galleryBadge', '')}
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
                    onChange={(e) => updateSectionText('galleryTitle', e.target.value)}
                    placeholder="Judul galeri..."
                    className="text-2xl font-bold text-center border border-slate-300 rounded-lg p-2 w-full"
                  />
                  <button
                    onClick={() => updateSectionText('galleryTitle', '')}
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
                    onChange={(e) => updateSectionText('gallerySubtitle', e.target.value)}
                    placeholder="Subtitle galeri..."
                    className="text-xs text-center border border-slate-300 rounded-lg p-2 w-full"
                  />
                  <button
                    onClick={() => updateSectionText('gallerySubtitle', '')}
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

        {/* Action button in Edit Mode to add photo */}
        {isEditMode && (
          <div className="text-center mb-8">
            <button
              onClick={onOpenAdminModal}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Foto Kenangan Baru (Panel Editor)
            </button>
          </div>
        )}

        {/* Polaroid Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.memories.map((mem) => {
            const rotClass =
              mem.rotation && mem.rotation > 0
                ? 'rotate-1 hover:rotate-0'
                : mem.rotation && mem.rotation < 0
                ? '-rotate-1 hover:rotate-0'
                : 'hover:-translate-y-1';

            return (
              <div
                key={mem.id}
                onClick={() => !isEditMode && setSelectedPhoto(mem)}
                className={`bg-white p-4 pb-6 rounded-2xl border border-[#e5ded2] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative ${
                  isEditMode ? 'cursor-default ring-2 ring-rose-200' : 'cursor-pointer'
                } ${rotClass}`}
              >
                {/* Delete button in Edit Mode */}
                {isEditMode && (
                  <button
                    onClick={(e) => handleDeleteMemory(mem.id, e)}
                    className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
                    title="Hapus foto ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Visual Image Container */}
                <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 mb-4">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {!isEditMode && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-md">
                        <ZoomIn className="w-5 h-5" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Polaroid Caption Area */}
                <div className="space-y-2">
                  {isEditMode ? (
                    <div className="space-y-2 text-left">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase">
                          Tanggal / Momen:
                        </label>
                        <input
                          type="text"
                          value={mem.date}
                          onChange={(e) => handleUpdateMemory(mem.id, { date: e.target.value })}
                          className="w-full text-xs px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase">
                          Judul Foto:
                        </label>
                        <input
                          type="text"
                          value={mem.title}
                          onChange={(e) => handleUpdateMemory(mem.id, { title: e.target.value })}
                          className="w-full text-xs font-bold px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase">
                          Caption Cerita:
                        </label>
                        <textarea
                          rows={2}
                          value={mem.caption}
                          onChange={(e) =>
                            handleUpdateMemory(mem.id, { caption: e.target.value })
                          }
                          className="w-full text-xs px-2 py-1 border border-slate-300 rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{mem.date}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base group-hover:text-rose-600 transition-colors">
                        {mem.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {mem.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-4/3 w-full bg-slate-900">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedPhoto.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
