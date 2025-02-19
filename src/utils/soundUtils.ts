let audioContext: AudioContext | null = null;

const createOscillator = (frequency: number, duration: number): void => {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Create a short fade out
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
};

export const playTickSound = (): void => {
  createOscillator(440, 0.1); // A4 note, short duration
};

export const playTimeUpSound = (): void => {
  // Play a descending sequence
  setTimeout(() => createOscillator(440, 0.2), 0);    // A4
  setTimeout(() => createOscillator(392, 0.2), 200);  // G4
  setTimeout(() => createOscillator(349.23, 0.3), 400); // F4
};

export const playVictorySound = (): void => {
  // Play an ascending sequence
  setTimeout(() => createOscillator(392, 0.2), 0);     // G4
  setTimeout(() => createOscillator(493.88, 0.2), 200); // B4
  setTimeout(() => createOscillator(587.33, 0.4), 400); // D5
};

let isMuted = false;

export const toggleMute = (): void => {
  isMuted = !isMuted;
};

export const isSoundMuted = (): boolean => isMuted;

export const playSound = (type: 'tick' | 'timeUp' | 'victory'): void => {
  if (isMuted) return;

  switch (type) {
    case 'tick':
      playTickSound();
      break;
    case 'timeUp':
      playTimeUpSound();
      break;
    case 'victory':
      playVictorySound();
      break;
  }
};