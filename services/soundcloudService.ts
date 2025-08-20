import { Beat, SoundCloudTrack, Mood, Key } from '../types';
import { MOCK_SOUNDCLOUD_API_RESPONSE } from '../constants';

const SOUNDCLOUD_API_BASE = 'https://api.soundcloud.com';

const getSoundCloudClientId = (): string | null => {
  return process.env.SOUNDCLOUD_CLIENT_ID || null;
};

// Helper to assign a random value from an enum
const getRandomEnum = <T extends {}>(anEnum: T): T[keyof T] => {
  const enumValues = Object.values(anEnum);
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex] as T[keyof T];
};

// A map to provide working audio URLs for our mock data
const MOCK_AUDIO_SRC_MAP: Record<number, string> = {
  101: 'https://storage.googleapis.com/vsl-assets/kh/_sample_music/lofi-1.mp3',
  102: 'https://storage.googleapis.com/vsl-assets/kh/_sample_music/music-2.mp3',
  103: 'https://storage.googleapis.com/vsl-assets/kh/_sample_music/music-3.mp3',
  104: 'https://storage.googleapis.com/vsl-assets/kh/_sample_music/music-4.mp3',
  105: 'https://storage.googleapis.com/vsl-assets/kh/_sample_music/music-5.mp3',
};

const mapTrackToBeat = (track: SoundCloudTrack, clientId?: string | null, isMock: boolean = false): Beat | null => {
  if (!track.streamable) {
    return null;
  }
    
  const artwork = track.artwork_url ? track.artwork_url.replace('-large', '-t500x500') : `https://picsum.photos/seed/${track.id}/500/500`;

  let audioSrc = '';
  if (isMock) {
    // For mock data, we use our own hosted audio files.
    audioSrc = MOCK_AUDIO_SRC_MAP[track.id] || '';
  } else if (clientId) {
    // For real data, we construct the stream URL with the client ID.
    audioSrc = `${track.stream_url}?client_id=${clientId}`;
  }

  if (!audioSrc) return null; // Don't create a beat if there's no audio source

  return {
    id: track.id,
    title: track.title,
    producer: track.user.username,
    artwork: artwork,
    bpm: track.bpm || Math.floor(Math.random() * (160 - 80 + 1)) + 80,
    key: getRandomEnum(Key),
    mood: getRandomEnum(Mood),
    leasePrice: parseFloat((Math.random() * (39.99 - 19.99) + 19.99).toFixed(2)),
    exclusivePrice: parseFloat((Math.random() * (499.99 - 249.99) + 249.99).toFixed(2)),
    audioSrc: audioSrc,
  };
};

const getMockBeats = (): Beat[] => {
    console.warn(
      `SoundCloud API client ID is not configured or the API call failed. ` +
      `Falling back to mock data. This is expected in a development environment.`
    );
    return MOCK_SOUNDCLOUD_API_RESPONSE
        .map(track => mapTrackToBeat(track, null, true))
        .filter((beat): beat is Beat => beat !== null);
}

// Export the mapping function for use in backend
export const mapSoundCloudTrackToBeat = mapTrackToBeat;

export const searchSoundCloudBeats = async (query: string): Promise<Beat[]> => {
  const clientId = getSoundCloudClientId();
  
  if (!clientId) {
    return getMockBeats();
  }
  
  const url = `${SOUNDCLOUD_API_BASE}/tracks?q=${encodeURIComponent(query)}&limit=20&client_id=${clientId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`SoundCloud API responded with status: ${response.status}`);
    }
    
    const tracks: SoundCloudTrack[] = await response.json();
    
    return tracks
      .map(track => mapTrackToBeat(track, clientId))
      .filter((beat): beat is Beat => beat !== null);

  } catch (error) {
    console.error("Error fetching from SoundCloud:", error);
    return getMockBeats(); // Fallback to mocks on any fetch error
  }
};