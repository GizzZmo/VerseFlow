export enum Mood {
  Hype = 'Hype',
  Chill = 'Chill',
  Dark = 'Dark',
  Sad = 'Sad',
  Energetic = 'Energetic',
  Soulful = 'Soulful',
  Experimental = 'Experimental',
}

export enum Key {
  Cmaj = 'Cmaj',
  Cmin = 'Cmin',
  Dmaj = 'Dmaj',
  Dmin = 'Dmin',
  Emaj = 'Emaj',
  Emin = 'Emin',
  Fmaj = 'Fmaj',
  Fmin = 'Fmin',
  Gmaj = 'Gmaj',
  Gmin = 'Gmin',
  Amaj = 'Amaj',
  Amin = 'Amin',
  Bmaj = 'Bmaj',
  Bmin = 'Bmin',
}

export interface Beat {
  id: number;
  title: string;
  producer: string;
  artwork: string;
  bpm: number;
  key: Key;
  mood: Mood;
  leasePrice: number;
  exclusivePrice: number;
  audioSrc: string;
}

export interface AiSuggestion {
  bpm: number;
  key: Key;
  mood: Mood;
}

// Represents the structure of a track object from the SoundCloud API
export interface SoundCloudTrack {
  id: number;
  title: string;
  user: {
    username: string;
  };
  artwork_url: string | null;
  bpm: number | null;
  genre: string;
  stream_url: string;
  streamable: boolean;
}

// Types for "The Cypher" Collaboration Hub
export enum Skill {
    Rapping = 'Rapping',
    Vocals = 'Vocals',
    Production = 'Production',
    Mixing = 'Mixing',
    Mastering = 'Mastering',
    Songwriting = 'Songwriting',
}

export interface TalentProfile {
    id: number;
    name: string;
    avatar: string;
    skills: Skill[];
}

export interface CurrentUser {
    id: number;
    name: string;
    avatar: string;
    skills: Skill[];
}

export interface CollaborationProject {
    id: number;
    title: string;
    description: string;
    postedBy: number; // Corresponds to a TalentProfile id
    requiredSkills: Skill[];
    status?: 'open' | 'in_progress' | 'completed';
    createdAt?: string;
    tags?: string[];
}

// Collaboration request sent from one user to another
export interface CollaborationRequest {
    id: number;
    fromUserId: number;
    toUserId: number;
    projectId?: number;
    message: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
}

// Direct message between two users
export interface Message {
    id: number;
    fromUserId: number;
    toUserId: number;
    content: string;
    createdAt: string;
    read: boolean;
}

// Full artist profile (extends TalentProfile)
export interface ArtistProfile extends TalentProfile {
    bio?: string;
    location?: string;
    genres?: string[];
    soundcloudUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    openToCollaboration: boolean;
    projectsPosted?: number[];
    connections?: number[]; // user IDs of accepted collaborators
}

// API v1 response wrapper
export interface ApiResponse<T> {
    data: T;
    error?: string;
    status: number;
}

// Beat suggestion request for AI service
export interface BeatSuggestionRequest {
    prompt: string;
    genre?: string;
    referenceArtist?: string;
}

// Extended AI suggestion with reasoning
export interface AiSuggestionExtended extends AiSuggestion {
    reasoning?: string;
    suggestedGenre?: string;
    referenceArtists?: string[];
}