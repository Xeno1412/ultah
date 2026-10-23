import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, Eye, EyeOff, ShieldCheck, HeartHandshake } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';
import { soundPlayer } from '../utils/sound';

interface PasswordGateProps {
  onUnlockSuccess: () => void;
  onOpenAdminModal: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({
  onUnlockSuccess,
  onOpenAdminModal
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Masukkan kata sandi terlebih dahulu ya.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/verify-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        soundPlayer.playCelebrationChime();
        soundPlayer.startMelody();
        fireCelebrationConfetti();
        onUnlockSuccess();
      } else {
        setErrorMsg(data.message || 'Password salah. Coba periksa kembali!');
      }
    } catch (err) {
      // Local fallback check if offline
      if (password.toLowerCase() === 'teman2026') {
        soundPlayer.playCelebrationChime();
        soundPlayer.startMelody();
        fireCelebrationConfetti();
        onUnlockSuccess();
      } else {
        setErrorMsg('Gagal memeriksa password. Coba lagi!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfbf7] via-[#faf5ec] to-[#f4ede0] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Soft decorative background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Envelope Card */}
      <div className="w-full max-w-md bg-white border border-[#e8e0d4] rounded-2xl shadow-xl p-6 sm:p-8 relative z-10 text-center transition-all">
        {/* Envelope Stamp Icon */}
        <div className="mx-auto w-18 h-18 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center mb-5">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl">
            💌
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <span className="text-xs font-semibold tracking-wider text-rose-600 uppercase bg-rose-50 px-2.5 py-1 rounded-md">
            Surat Rahasia Spesial
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Ada Kado Khusus Untukmu!
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Halaman ini dikunci kata sandi. Masukkan password yang telah diberikan untuk membuka ucapan & perayaan.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Masukkan password teman..."
              className="w-full pl-10 pr-10 py-3 bg-[#fbf9f5] border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm font-medium transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-600 text-left flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Buka Hadiah Ulang Tahun</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Owner Admin Switch */}
      <div className="mt-6 text-center z-10">
        <button
          onClick={onOpenAdminModal}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/50"
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Kamu pemilik web ini? Masuk Mode Admin (PIN)</span>
        </button>
      </div>
    </div>
  );
};
