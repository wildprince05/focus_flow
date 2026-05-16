import { useEffect, useRef } from 'react';

const SOUND_URLS = {
  rain: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
  cafe: 'https://assets.mixkit.co/active_storage/sfx/171/171-preview.mp3',
  'white-noise': 'https://assets.mixkit.co/active_storage/sfx/1241/1241-preview.mp3',
};

export const useAmbientSound = (soundType) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!soundType || soundType === 'none' || !SOUND_URLS[soundType]) return;

    const audio = new Audio(SOUND_URLS[soundType]);
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [soundType]);

  return { stop: () => audioRef.current?.pause() };
};
