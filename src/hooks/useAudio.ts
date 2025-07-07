import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';

interface AudioHookReturn {
  isLoaded: boolean;
  isPlaying: boolean;
  playNote: (note: string, octave?: number, duration?: string) => Promise<void>;
  playChord: (notes: string[], duration?: string) => Promise<void>;
  playScale: (notes: string[], interval?: number) => Promise<void>;
  stopAll: () => void;
  setVolume: (volume: number) => void;
}

export const useAudio = (): AudioHookReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth, setSynth] = useState<Tone.Synth | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        // Initialize Tone.js synth
        const synthInstance = new Tone.Synth().toDestination();
        setSynth(synthInstance);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, []);

  const playNote = useCallback(async (note: string, octave: number = 4, duration: string = '8n') => {
    if (!synth || !isLoaded) return;

    try {
      await Tone.start();
      setIsPlaying(true);
      
      const noteWithOctave = `${note}${octave}`;
      synth.triggerAttackRelease(noteWithOctave, duration);
      
      setTimeout(() => setIsPlaying(false), Tone.Time(duration).toMilliseconds());
    } catch (error) {
      console.error('Failed to play note:', error);
      setIsPlaying(false);
    }
  }, [synth, isLoaded]);

  const playChord = useCallback(async (notes: string[], duration: string = '2n') => {
    if (!synth || !isLoaded) return;

    try {
      await Tone.start();
      setIsPlaying(true);

      // Create a polyphonic synth for chord playback
      const polySynth = new Tone.PolySynth().toDestination();
      
      const notesWithOctave = notes.map(note => `${note}4`);
      polySynth.triggerAttackRelease(notesWithOctave, duration);
      
      setTimeout(() => {
        setIsPlaying(false);
        polySynth.dispose();
      }, Tone.Time(duration).toMilliseconds());
    } catch (error) {
      console.error('Failed to play chord:', error);
      setIsPlaying(false);
    }
  }, [synth, isLoaded]);

  const playScale = useCallback(async (notes: string[], interval: number = 500) => {
    if (!synth || !isLoaded) return;

    try {
      await Tone.start();
      setIsPlaying(true);

      for (let i = 0; i < notes.length; i++) {
        setTimeout(() => {
          // Vérifier si la note contient déjà l'octave (ex: "C4") ou non (ex: "C")
          const note = notes[i];
          const noteWithOctave = /\d$/.test(note) ? note : `${note}4`;
          synth.triggerAttackRelease(noteWithOctave, '8n');
          
          if (i === notes.length - 1) {
            setTimeout(() => setIsPlaying(false), 200);
          }
        }, i * interval);
      }
    } catch (error) {
      console.error('Failed to play scale:', error);
      setIsPlaying(false);
    }
  }, [synth, isLoaded]);

  const stopAll = useCallback(() => {
    if (synth) {
      synth.triggerRelease();
    }
    setIsPlaying(false);
  }, [synth]);

  const setVolume = useCallback((volume: number) => {
    if (synth) {
      synth.volume.value = Tone.gainToDb(volume);
    }
  }, [synth]);

  return {
    isLoaded,
    isPlaying,
    playNote,
    playChord,
    playScale,
    stopAll,
    setVolume
  };
};