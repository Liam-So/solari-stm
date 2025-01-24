class SoundEffect {
  private audio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/flip-sound.wav');
      this.audio.volume = 0.3;
    }
  }

  playFlipSound(volume: number = 0.3) {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.volume = volume;
      this.audio.play().catch(() => {});
    }
  }
}

export const soundEffect = new SoundEffect(); 