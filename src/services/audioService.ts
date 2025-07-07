import * as Tone from 'tone';

class AudioService {
  private players: Map<string, Tone.Player> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await Tone.start();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AudioService:', error);
    }
  }

  async loadNote(note: string, octave: number): Promise<void> {
    const noteKey = `${note}${octave}`;
    
    if (this.players.has(noteKey)) return;

    try {
      // Try to load the audio file from your assets
      const audioPath = `/assets/audio/notes/${noteKey}.wav`;
      const player = new Tone.Player(audioPath).toDestination();
      
      await new Promise<void>((resolve, reject) => {
        player.load(audioPath).then(() => resolve()).catch(reject);
      });
      
      this.players.set(noteKey, player);
    } catch (error) {
      console.warn(`Failed to load audio file for ${noteKey}, using synth fallback`);
      // Fallback to synth if audio file not found
    }
  }

  async playNote(note: string, octave: number = 4): Promise<void> {
    await this.initialize();
    
    const noteKey = `${note}${octave}`;
    const player = this.players.get(noteKey);
    
    if (player && player.loaded) {
      player.start();
    } else {
      // Fallback to synth
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease(`${note}${octave}`, '8n');
      setTimeout(() => synth.dispose(), 1000);
    }
  }

  async playChord(notes: string[], octave: number = 4): Promise<void> {
    await this.initialize();
    
    // Play all notes simultaneously
    const promises = notes.map(note => this.playNote(note, octave));
    await Promise.all(promises);
  }

  async playScale(notes: string[], octave: number = 4, interval: number = 500): Promise<void> {
    await this.initialize();
    
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playNote(notes[i], octave);
      }, i * interval);
    }
  }

  dispose(): void {
    this.players.forEach(player => player.dispose());
    this.players.clear();
    this.isInitialized = false;
  }
}

export const audioService = new AudioService();