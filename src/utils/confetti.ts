import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fbbf24']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#e11d48', '#ec4899', '#f43f5e', '#10b981', '#3b82f6']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ffffff']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#f43f5e', '#fbbf24', '#e0e7ff']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}

export function fireSideCannons() {
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#f43f5e', '#f59e0b', '#ec4899', '#10b981'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: colors,
      zIndex: 9999
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: colors,
      zIndex: 9999
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
