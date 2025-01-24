class SoundEffect {
  private audioContext: AudioContext
  private oscillator: OscillatorNode | null = null

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  playFlipSound(duration = 0.1) {
    this.oscillator = this.audioContext.createOscillator()
    this.oscillator.type = "square"
    this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    this.oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    this.oscillator.start()
    this.oscillator.stop(this.audioContext.currentTime + duration)
  }
}

export const soundEffect = new SoundEffect()

