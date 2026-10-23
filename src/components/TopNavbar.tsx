import React from 'react';
import { Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';

interface TopNavbarProps {
  recipientNickname: string;
  isMelodyPlaying: boolean;
  onToggleMelody: () => void;
  onOpenAdmin: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  recipientNickname,
  isMelodyPlaying,
  onToggleMelody,
  onOpenAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e9e3d8] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-slate-800 hover:text-rose-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm shadow-xs">
            🎉
          </span>
          <span>Untuk {recipientNickname}</span>
        </a>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#greeting"
            className="hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
          >
            Surat Ucapan
          </a>
          <a
            href="#cake"
            className="hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
          >
            Tiup Lilin
          </a>
          <a
            href="#memories"
            className="hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
          >
            Foto Kenangan
          </a>
          <a
            href="#response"
            className="hover:text-rose-600 transition-colors whitespace-nowrap shrink-0"
          >
            Kirim Balasan
          </a>
        </nav>

        {/* Zone 3: Primary Action & Audio Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleMelody}
            title={isMelodyPlaying ? 'Jeda Musik' : 'Putar Musik Ulang Tahun'}
            className={`p-2 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 ${
              isMelodyPlaying
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs animate-pulse'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {isMelodyPlaying ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Musik Nyala</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Nyalakan Musik</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Pemilik</span>
          </button>
        </div>
      </div>
    </header>
  );
};
