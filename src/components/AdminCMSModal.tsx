import React, { useState } from 'react';
import {
  X,
  Lock,
  KeyRound,
  Save,
  Trash2,
  Plus,
  Inbox,
  Image as ImageIcon,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  Layout
} from 'lucide-react';
import { apiFetch, resolveAssetUrl } from '../utils/api';
import type { BirthdayContent, FriendResponse, MemoryItem, SectionTexts } from '../types';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentUpdated: (newContent: BirthdayContent) => void;
  onToggleVisualEditMode?: () => void;
  isVisualEditMode?: boolean;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  onContentUpdated,
  onToggleVisualEditMode,
  isVisualEditMode
}) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'content' | 'sections' | 'memories' | 'inbox' | 'settings'
  >('content');
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Editable state
  const [formData, setFormData] = useState<BirthdayContent | null>(null);
  const [responses, setResponses] = useState<FriendResponse[]>([]);
  const [showPin, setShowPin] = useState(false);

  // New Memory Form State
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemDate, setNewMemDate] = useState('');
  const [newMemCaption, setNewMemCaption] = useState('');
  const [newMemUrl, setNewMemUrl] = useState('');

  // New Wish input
  const [newWish, setNewWish] = useState('');

  if (!isOpen) return null;

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const res = await apiFetch('api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        setFormData(data.fullContent);
        fetchResponses(pin);
      } else {
        setAuthError(data.message || 'PIN Admin salah.');
      }
    } catch {
      setAuthError('Gagal memverifikasi PIN.');
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async (adminPin: string) => {
    try {
      const res = await apiFetch('api/responses', {
        headers: { 'x-admin-pin': adminPin }
      });
      const data = await res.json();
      if (data.success) {
        setResponses(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch responses:', err);
    }
  };

  const handleSaveAll = async () => {
    if (!formData) return;
    setLoading(true);
    setSaveMessage(null);

    try {
      const res = await apiFetch('api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          content: formData
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSaveMessage({
          type: 'success',
          text: 'Semua perubahan teks dan konten berhasil disimpan dan langsung aktif!'
        });
        onContentUpdated(data.data);
      } else {
        setSaveMessage({ type: 'error', text: data.message || 'Gagal menyimpan perubahan.' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Koneksi error saat menyimpan data.' });
    } finally {
      setLoading(false);
    }
  };

  const updateSectionText = (key: keyof SectionTexts, val: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      sectionTexts: {
        ...formData.sectionTexts,
        [key]: val
      }
    });
  };

  const handleDeleteResponse = async (id: string) => {
    if (!confirm('Hapus balasan ini?')) return;
    try {
      await apiFetch(`api/responses/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin }
      });
      setResponses(responses.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMemory = () => {
    if (!formData || !newMemTitle || !newMemUrl) {
      alert('Judul foto dan tautan gambar/foto wajib diisi.');
      return;
    }

    const newItem: MemoryItem = {
      id: 'mem-' + Date.now(),
      title: newMemTitle,
      date: newMemDate || 'Momen Bahagia',
      caption: newMemCaption || '',
      imageUrl: newMemUrl,
      rotation: Math.floor(Math.random() * 5) - 2
    };

    setFormData({
      ...formData,
      memories: [...formData.memories, newItem]
    });

    setNewMemTitle('');
    setNewMemDate('');
    setNewMemCaption('');
    setNewMemUrl('');
  };

  const handleUpdateMemoryItem = (id: string, updates: Partial<MemoryItem>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      memories: formData.memories.map((m) => (m.id === id ? { ...m, ...updates } : m))
    });
  };

  const handleRemoveMemory = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      memories: formData.memories.filter((m) => m.id !== id)
    });
  };

  const handleAddWish = () => {
    if (!formData || !newWish.trim()) return;
    setFormData({
      ...formData,
      wishesList: [...formData.wishesList, newWish.trim()]
    });
    setNewWish('');
  };

  const handleRemoveWish = (idx: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      wishesList: formData.wishesList.filter((_, i) => i !== idx)
    });
  };

  const st = formData?.sectionTexts || ({} as Partial<SectionTexts>);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-base sm:text-lg">
              Panel Pengelola &amp; Editor Konten (Mode Pemilik)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Unlocked State (PIN Form) */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-700">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              Masukkan PIN Pemilik
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              PIN ini khusus untukmu agar dapat mengedit atau menghapus teks ucapan, foto, ganti password teman, dan melihat kotak pesan masuk.
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Masukkan PIN Admin..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono text-base font-bold tracking-widest text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <p className="text-xs font-semibold text-rose-600">{authError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
              >
                {loading ? 'Memeriksa...' : 'Buka Panel Editor'}
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Content Editor */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Visual Edit Mode Bar */}
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>
                  <strong>Tips:</strong> Kamu juga bisa mengaktifkan{' '}
                  <strong>Mode Edit Langsung di Halaman</strong> untuk edit/hapus teks sambil melihat tampilan asli web!
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onToggleVisualEditMode?.();
                  onClose();
                }}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>{isVisualEditMode ? 'Lihat Halaman Edit' : 'Edit Langsung di Halaman'}</span>
              </button>
            </div>

            {/* Tabs Bar */}
            <div className="flex border-b border-slate-200 px-6 pt-3 gap-2 sm:gap-4 overflow-x-auto shrink-0 bg-slate-50">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-3 px-2 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'content'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Teks Utama &amp; Surat</span>
              </button>

              <button
                onClick={() => setActiveTab('sections')}
                className={`pb-3 px-2 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'sections'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Teks Lilin, Galeri &amp; Balasan</span>
              </button>

              <button
                onClick={() => setActiveTab('memories')}
                className={`pb-3 px-2 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'memories'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Edit Foto ({formData?.memories.length || 0})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('inbox');
                  fetchResponses(pin);
                }}
                className={`pb-3 px-2 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'inbox'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Pesan Masuk ({responses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-2 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Password &amp; Email</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {saveMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    saveMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {saveMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{saveMessage.text}</span>
                </div>
              )}

              {/* TAB 1: CONTENT */}
              {activeTab === 'content' && formData && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Nama Lengkap Teman:
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, recipientName: '' })}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus / Kosongkan
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.recipientName}
                        onChange={(e) =>
                          setFormData({ ...formData, recipientName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Panggilan Akrab:
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, nickname: '' })}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus / Kosongkan
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) =>
                          setFormData({ ...formData, nickname: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Tanggal Ulang Tahun:
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, birthDate: '' })}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({ ...formData, birthDate: e.target.value })
                        }
                        placeholder="Contoh: 03 NOVEMBER 2026"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Keterangan Usia:
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, ageText: '' })}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formData.ageText}
                        onChange={(e) =>
                          setFormData({ ...formData, ageText: e.target.value })
                        }
                        placeholder="Contoh: Ke-16"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Judul Surat Sambutan:
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroTitle: '' })}
                        className="text-[10px] text-slate-400 hover:text-rose-600"
                      >
                        Hapus Judul
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.heroTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, heroTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Teks Subtitle Sambutan (Hero):
                      </label>
                      <button
                        type="button"
                        onClick={() => updateSectionText('heroSubtitle', '')}
                        className="text-[10px] text-slate-400 hover:text-rose-600"
                      >
                        Hapus Subtitle
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={st.heroSubtitle || ''}
                      onChange={(e) => updateSectionText('heroSubtitle', e.target.value)}
                      placeholder="Tulis subtitle atau hapus agar tidak muncul..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Isi Surat Ucapan Utama:
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, greetingMessage: '' })}
                        className="text-[10px] text-slate-400 hover:text-rose-600"
                      >
                        Kosongkan Isi Surat
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={formData.greetingMessage}
                      onChange={(e) =>
                        setFormData({ ...formData, greetingMessage: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Label Atas Surat (Kicker):
                        </label>
                        <button
                          type="button"
                          onClick={() => updateSectionText('letterKicker', '')}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <input
                        type="text"
                        value={st.letterKicker || ''}
                        onChange={(e) => updateSectionText('letterKicker', e.target.value)}
                        placeholder="Contoh: Dari Hati yang Paling Tulus"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                          Tanda Tangan Surat:
                        </label>
                        <button
                          type="button"
                          onClick={() => updateSectionText('letterSignature', '')}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <input
                        type="text"
                        value={st.letterSignature || ''}
                        onChange={(e) => updateSectionText('letterSignature', e.target.value)}
                        placeholder="Contoh: — Sahabatmu"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Catatan Rahasia (Terbuka saat lilin ditiup):
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, secretLetter: '' })}
                        className="text-[10px] text-slate-400 hover:text-rose-600"
                      >
                        Hapus Catatan Rahasia
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.secretLetter}
                      onChange={(e) =>
                        setFormData({ ...formData, secretLetter: e.target.value })
                      }
                      placeholder="Tuliskan catatan rahasia di sini atau kosongkan..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800"
                    />
                  </div>

                  {/* Wishes Manager */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Daftar Doa &amp; Harapan:
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, wishesList: [] })}
                        className="text-[10px] text-slate-400 hover:text-rose-600"
                      >
                        Hapus Semua Doa
                      </button>
                    </div>

                    <div className="space-y-2 mb-3">
                      {formData.wishesList.map((wish, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <span className="text-xs font-bold text-slate-400 w-5">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={wish}
                            onChange={(e) => {
                              const updated = [...formData.wishesList];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, wishesList: updated });
                            }}
                            className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveWish(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Hapus baris doa ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tambah doa atau harapan baru..."
                        value={newWish}
                        onChange={(e) => setNewWish(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddWish}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SECTIONS TEXT */}
              {activeTab === 'sections' && formData && (
                <div className="space-y-6">
                  {/* Lilin Kue */}
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-amber-900 uppercase">
                      Bagian Tiup Lilin Kue:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Badge Lilin:
                          </label>
                          <button
                            onClick={() => updateSectionText('cakeBadge', '')}
                            className="text-[10px] text-slate-400 hover:text-rose-600"
                          >
                            Hapus
                          </button>
                        </div>
                        <input
                          type="text"
                          value={st.cakeBadge || ''}
                          onChange={(e) => updateSectionText('cakeBadge', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Teks Tombol Tiup:
                          </label>
                          <button
                            onClick={() => updateSectionText('cakeBlowBtn', '')}
                            className="text-[10px] text-slate-400 hover:text-rose-600"
                          >
                            Hapus
                          </button>
                        </div>
                        <input
                          type="text"
                          value={st.cakeBlowBtn || ''}
                          onChange={(e) => updateSectionText('cakeBlowBtn', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          Judul Tiup Lilin:
                        </label>
                        <button
                          onClick={() => updateSectionText('cakeTitle', '')}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <input
                        type="text"
                        value={st.cakeTitle || ''}
                        onChange={(e) => updateSectionText('cakeTitle', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          Subtitle Tiup Lilin:
                        </label>
                        <button
                          onClick={() => updateSectionText('cakeSubtitle', '')}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={st.cakeSubtitle || ''}
                        onChange={(e) => updateSectionText('cakeSubtitle', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Galeri Foto */}
                  <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-rose-900 uppercase">
                      Bagian Galeri Foto:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Badge Galeri:
                          </label>
                          <button
                            onClick={() => updateSectionText('galleryBadge', '')}
                            className="text-[10px] text-slate-400 hover:text-rose-600"
                          >
                            Hapus
                          </button>
                        </div>
                        <input
                          type="text"
                          value={st.galleryBadge || ''}
                          onChange={(e) => updateSectionText('galleryBadge', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Judul Galeri:
                          </label>
                          <button
                            onClick={() => updateSectionText('galleryTitle', '')}
                            className="text-[10px] text-slate-400 hover:text-rose-600"
                          >
                            Hapus
                          </button>
                        </div>
                        <input
                          type="text"
                          value={st.galleryTitle || ''}
                          onChange={(e) => updateSectionText('galleryTitle', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          Subtitle Galeri:
                        </label>
                        <button
                          onClick={() => updateSectionText('gallerySubtitle', '')}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={st.gallerySubtitle || ''}
                        onChange={(e) => updateSectionText('gallerySubtitle', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Form Balasan */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      Bagian Formulir Balasan:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Badge Balasan:
                          </label>
                          <button
                            onClick={() => updateSectionText('responseBadge', '')}
                            className="text-[10px] text-slate-400 hover:text-rose-600"
                          >
                            Hapus
                          </button>
                        </div>
                        <input
                          type="text"
                          value={st.responseBadge || ''}
                          onChange={(e) => updateSectionText('responseBadge', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-600">
                            Teks Tombol Kirim:
                          </label>
                          <button
                            onClick={() => updateSectionText('responseSubmitBtn', '')}
                            className="text-[10px] text-slate-400 hover:text-rose-600"
                          >
                            Hapus
                          </button>
                        </div>
                        <input
                          type="text"
                          value={st.responseSubmitBtn || ''}
                          onChange={(e) =>
                            updateSectionText('responseSubmitBtn', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          Judul Formulir Balasan:
                        </label>
                        <button
                          onClick={() => updateSectionText('responseTitle', '')}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <input
                        type="text"
                        value={st.responseTitle || ''}
                        onChange={(e) => updateSectionText('responseTitle', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-600">
                          Subtitle Formulir Balasan:
                        </label>
                        <button
                          onClick={() => updateSectionText('responseSubtitle', '')}
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Hapus
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={st.responseSubtitle || ''}
                        onChange={(e) =>
                          updateSectionText('responseSubtitle', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MEMORIES */}
              {activeTab === 'memories' && formData && (
                <div className="space-y-6">
                  {/* Current Photos */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">
                      Edit Judul, Tanggal, dan Cerita Foto Saat Ini:
                    </h4>
                    <div className="space-y-4">
                      {formData.memories.map((mem) => (
                        <div
                          key={mem.id}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-4 items-start"
                        >
                          <img
                            src={resolveAssetUrl(mem.imageUrl)}
                            alt={mem.title}
                            className="w-24 h-24 rounded-xl object-cover bg-slate-200 shrink-0 border border-slate-300"
                          />
                          <div className="flex-1 w-full space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                                  Judul Foto:
                                </label>
                                <input
                                  type="text"
                                  value={mem.title}
                                  onChange={(e) =>
                                    handleUpdateMemoryItem(mem.id, { title: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                                  Tanggal / Momen:
                                </label>
                                <input
                                  type="text"
                                  value={mem.date}
                                  onChange={(e) =>
                                    handleUpdateMemoryItem(mem.id, { date: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1 border border-slate-300 rounded-lg text-xs bg-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block">
                                Caption / Cerita Foto:
                              </label>
                              <textarea
                                rows={2}
                                value={mem.caption}
                                onChange={(e) =>
                                  handleUpdateMemoryItem(mem.id, { caption: e.target.value })
                                }
                                className="w-full px-2.5 py-1 border border-slate-300 rounded-lg text-xs bg-white"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveMemory(mem.id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 cursor-pointer"
                            title="Hapus foto ini dari galeri"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sm:hidden">Hapus</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Memory Card */}
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
                    <h4 className="text-xs font-bold text-amber-900 uppercase mb-3 flex items-center gap-1.5">
                      <Plus className="w-4 h-4" /> Tambah Foto Kenangan Baru
                    </h4>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Judul momen..."
                          value={newMemTitle}
                          onChange={(e) => setNewMemTitle(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Tanggal / Waktu..."
                          value={newMemDate}
                          onChange={(e) => setNewMemDate(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="Tautan URL Gambar / Foto..."
                        value={newMemUrl}
                        onChange={(e) => setNewMemUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                        <span>Preset Foto Cepat:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewMemUrl('/assets/aistudio/WIN_20260819_09_22_37_Pro_e4105511.jpg');
                            setNewMemTitle('mapel produkti pertama bawa laptop');
                            setNewMemDate('Momen Kelas');
                          }}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100"
                        >
                          Foto Bawa Laptop
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewMemUrl('/assets/aistudio/image_c025fd4f.png');
                            setNewMemTitle('fotbar brg hantu');
                            setNewMemDate('Momen Seru');
                          }}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100"
                        >
                          Fotbar Brg Hantu
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewMemUrl('/assets/aistudio/image_ee633278.png');
                            setNewMemTitle('day terakhir PLH hedset');
                            setNewMemDate('Lorong Sekolah');
                          }}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100"
                        >
                          PLH Hedset
                        </button>
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Cerita atau caption manis tentang foto ini..."
                        value={newMemCaption}
                        onChange={(e) => setNewMemCaption(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />

                      <button
                        type="button"
                        onClick={handleAddMemory}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Masukkan ke Galeri
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INBOX */}
              {activeTab === 'inbox' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Daftar Balasan &amp; Doa dari Teman
                      </h4>
                      <p className="text-xs text-slate-500">
                        Setiap respon teman otomatis masuk ke sini dan dialirkan ke emailmu.
                      </p>
                    </div>
                    <button
                      onClick={() => fetchResponses(pin)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Refresh
                    </button>
                  </div>

                  {responses.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-medium text-slate-500">
                        Belum ada balasan yang masuk. Setelah temanmu mengisi form, pesannya akan langsung muncul di sini!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {responses.map((resp) => (
                        <div
                          key={resp.id}
                          className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{resp.reactionEmoji}</span>
                              <div>
                                <h5 className="font-bold text-sm text-slate-800">
                                  {resp.senderName}
                                </h5>
                                <p className="text-[11px] text-slate-400">
                                  {new Date(resp.createdAt).toLocaleString('id-ID', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteResponse(resp.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5"
                              title="Hapus pesan ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="p-3 bg-rose-50/50 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
                            {resp.message}
                          </div>

                          {resp.favoriteMemory && (
                            <p className="text-xs text-slate-500 italic">
                              <strong>Kenangan favorit:</strong> "{resp.favoriteMemory}"
                            </p>
                          )}

                          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Status Pengiriman Email:</span>
                            <span
                              className={`font-semibold ${
                                resp.emailDelivery?.success ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                            >
                              {resp.emailDelivery?.detail || 'Tercatat di server'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === 'settings' && formData && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Alamat Email Penerima Respon:
                    </label>
                    <input
                      type="email"
                      value={formData.notificationEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, notificationEmail: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Semua respon atau balasan dari teman akan otomatis ditujukan ke alamat email ini ({formData.notificationEmail}).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Password Teman (Buka Ucapan):
                      </label>
                      <input
                        type="text"
                        value={formData.friendPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, friendPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        PIN Admin (Akses Panel Ini):
                      </label>
                      <input
                        type="text"
                        value={formData.adminPin}
                        onChange={(e) =>
                          setFormData({ ...formData, adminPin: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Save Button) */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                Mode Admin Aktif · Data tersimpan persisten
              </span>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={loading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
