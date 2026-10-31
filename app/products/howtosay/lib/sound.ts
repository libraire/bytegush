// Web Audio API sound player with zero-latency buffer playback and synthesized fallback

class SoundController {
  private ctx: AudioContext | null = null;
  private pressBuffer: AudioBuffer | null = null;
  private alertBuffer: AudioBuffer | null = null;
  private completeBuffer: AudioBuffer | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('howtosay_sound_enabled');
      if (stored !== null) {
        this.enabled = stored === 'true';
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('howtosay_sound_enabled', String(val));
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (!this.initialized && this.ctx) {
      this.initialized = true;
      this.loadBuffer('/sounds/press.mp3', (buf) => (this.pressBuffer = buf));
      this.loadBuffer('/sounds/alert.mp3', (buf) => (this.alertBuffer = buf));
      this.loadBuffer('/sounds/completed.mp3', (buf) => (this.completeBuffer = buf));
    }
  }

  private loadBuffer(url: string, callback: (buf: AudioBuffer) => void) {
    if (!this.ctx) return;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Sound fetch error');
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => this.ctx!.decodeAudioData(arrayBuffer))
      .then(callback)
      .catch(() => {
        // Fallback to synthesized sound if file not available
      });
  }

  public play(name: 'press' | 'alert' | 'complete') {
    if (!this.enabled) return;
    this.initContext();

    if (!this.ctx) return;

    let buffer: AudioBuffer | null = null;
    if (name === 'press') buffer = this.pressBuffer;
    else if (name === 'alert') buffer = this.alertBuffer;
    else if (name === 'complete') buffer = this.completeBuffer;

    if (buffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gainNode = this.ctx.createGain();
        gainNode.gain.value = name === 'complete' ? 0.7 : 0.5;
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fallback to oscillator below
      }
    }

    // Synthesized sound fallback
    this.playSynthesized(name);
  }

  private playSynthesized(name: 'press' | 'alert' | 'complete') {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (name === 'press') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (name === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (name === 'complete') {
      // Arpeggio chime
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const subOsc = this.ctx!.createOscillator();
        const subGain = this.ctx!.createGain();
        const start = now + i * 0.07;
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(freq, start);
        subGain.gain.setValueAtTime(0.2, start);
        subGain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
        subOsc.connect(subGain);
        subGain.connect(this.ctx!.destination);
        subOsc.start(start);
        subOsc.stop(start + 0.28);
      });
    }
  }
}

export const soundManager = typeof window !== 'undefined' ? new SoundController() : ({} as SoundController);
