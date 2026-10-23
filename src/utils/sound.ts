// Web Audio API Synthesizer for birthday melodies and celebration chimes

class SoundPlayer {
  private ctx: AudioContext | null = null;
  private isMelodyPlaying: boolean = false;
  private melodyTimeout: any = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a chime note
  playTone(freq: number, duration: number = 0.4, type: OscillatorType = 'sine', volume: number = 0.15) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play a triumphant celebration chime
  playCelebrationChime() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.5, 'triangle', 0.2);
      }, idx * 110);
    });
  }

  // Blow candle sound effect (soft air whoosh + gentle chime)
  playBlowCandleSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Noise buffer for air whoosh
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.7);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.75);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 0.8);

      // Play soft sparkling chimes right after
      setTimeout(() => {
        this.playTone(880, 0.4, 'sine', 0.12);
        setTimeout(() => this.playTone(1174.66, 0.6, 'sine', 0.15), 140);
      }, 350);
    } catch {
      // Ignore audio error
    }
  }

  // Start warm acoustic "Happy Birthday" melody
  startMelody() {
    if (this.isMelodyPlaying) return;
    this.isMelodyPlaying = true;
    this.initCtx();

    // Notes for "Happy Birthday to you"
    // C4, C4, D4, C4, F4, E4
    // C4, C4, D4, C4, G4, F4
    // C4, C4, C5, A4, F4, E4, D4
    // Bb4, Bb4, A4, F4, G4, F4
    const melody = [
      { note: 261.63, dur: 300, gap: 360 }, // Hap-
      { note: 261.63, dur: 200, gap: 260 }, // py
      { note: 293.66, dur: 450, gap: 520 }, // birth-
      { note: 261.63, dur: 450, gap: 520 }, // day
      { note: 349.23, dur: 450, gap: 520 }, // to
      { note: 329.63, dur: 800, gap: 900 }, // you

      { note: 261.63, dur: 300, gap: 360 },
      { note: 261.63, dur: 200, gap: 260 },
      { note: 293.66, dur: 450, gap: 520 },
      { note: 261.63, dur: 450, gap: 520 },
      { note: 392.00, dur: 450, gap: 520 },
      { note: 349.23, dur: 800, gap: 900 },

      { note: 261.63, dur: 300, gap: 360 },
      { note: 261.63, dur: 200, gap: 260 },
      { note: 523.25, dur: 500, gap: 560 },
      { note: 440.00, dur: 500, gap: 560 },
      { note: 349.23, dur: 500, gap: 560 },
      { note: 329.63, dur: 500, gap: 560 },
      { note: 293.66, dur: 800, gap: 900 },

      { note: 466.16, dur: 300, gap: 360 },
      { note: 466.16, dur: 200, gap: 260 },
      { note: 440.00, dur: 500, gap: 560 },
      { note: 349.23, dur: 500, gap: 560 },
      { note: 392.00, dur: 500, gap: 560 },
      { note: 349.23, dur: 900, gap: 1200 }
    ];

    let currentIdx = 0;

    const playNext = () => {
      if (!this.isMelodyPlaying) return;
      const current = melody[currentIdx];
      // Warm marimba/music-box chime tone
      this.playTone(current.note, current.dur / 1000, 'triangle', 0.12);

      currentIdx = (currentIdx + 1) % melody.length;
      this.melodyTimeout = setTimeout(playNext, current.gap);
    };

    playNext();
  }

  stopMelody() {
    this.isMelodyPlaying = false;
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
  }

  toggleMelody(): boolean {
    if (this.isMelodyPlaying) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }

  getIsPlaying(): boolean {
    return this.isMelodyPlaying;
  }
}

export const soundPlayer = new SoundPlayer();
