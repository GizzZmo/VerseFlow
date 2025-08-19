import { TalentProfile, Skill, CollaborationProject, CurrentUser, SoundCloudTrack } from './types';

export const MOCK_CURRENT_USER: CurrentUser = {
    id: 99,
    name: 'VerseFlow Artist',
    avatar: 'https://i.pravatar.cc/150?u=verseflow-artist',
    skills: [Skill.Rapping, Skill.Songwriting],
};

// New Mock Data simulating a raw response from the SoundCloud API.
// This is used by the soundcloudService as a fallback.
export const MOCK_SOUNDCLOUD_API_RESPONSE: SoundCloudTrack[] = [
  {
    id: 101,
    title: 'Midnight Lofi',
    user: { username: 'Urban Groove' },
    artwork_url: 'https://picsum.photos/seed/101/500/500',
    bpm: 88,
    genre: 'Hip-hop & Rap',
    stream_url: 'https://api.soundcloud.com/tracks/101/stream',
    streamable: true,
  },
  {
    id: 102,
    title: 'City Lights',
    user: { username: 'SynthWaveKid' },
    artwork_url: 'https://picsum.photos/seed/102/500/500',
    bpm: 120,
    genre: 'Electronic',
    stream_url: 'https://api.soundcloud.com/tracks/102/stream',
    streamable: true,
  },
  {
    id: 103,
    title: 'Rainy Day Freestyle',
    user: { username: 'SadBoi Beatz' },
    artwork_url: 'https://picsum.photos/seed/103/500/500',
    bpm: 80,
    genre: 'Hip-hop & Rap',
    stream_url: 'https://api.soundcloud.com/tracks/103/stream',
    streamable: true,
  },
  {
    id: 104,
    title: 'The Cypher',
    user: { username: 'DJ Oldskool' },
    artwork_url: 'https://picsum.photos/seed/104/500/500',
    bpm: 95,
    genre: 'Hip-hop & Rap',
    stream_url: 'https://api.soundcloud.com/tracks/104/stream',
    streamable: true,
  },
   {
    id: 105,
    title: 'Hype Train',
    user: { username: '808 Mafia' },
    artwork_url: 'https://picsum.photos/seed/105/500/500',
    bpm: 140,
    genre: 'Trap',
    stream_url: 'https://api.soundcloud.com/tracks/105/stream',
    streamable: true,
  },
  // This track is intentionally not streamable to test the filtering logic.
  {
    id: 999,
    title: 'Not Streamable Track',
    user: { username: 'Copyright Holder' },
    artwork_url: null,
    bpm: 100,
    genre: 'Spoken Word',
    stream_url: 'https://api.soundcloud.com/tracks/999/stream',
    streamable: false,
  },
];


// Mock Data for "The Cypher"
export const MOCK_TALENT_PROFILES: TalentProfile[] = [
    { id: 1, name: 'Lyricist Prime', avatar: 'https://i.pravatar.cc/150?u=lyricistprime', skills: [Skill.Rapping, Skill.Songwriting] },
    { id: 2, name: 'Vocal Vixen', avatar: 'https://i.pravatar.cc/150?u=vocalvixen', skills: [Skill.Vocals, Skill.Songwriting] },
    { id: 3, name: '808 Architect', avatar: 'https://i.pravatar.cc/150?u=808architect', skills: [Skill.Production, Skill.Mastering] },
    { id: 4, name: 'Mix Master Mike', avatar: 'https://i.pravatar.cc/150?u=mixmastermike', skills: [Skill.Mixing, Skill.Mastering] },
    { id: 5, name: 'Rhyme Schemer', avatar: 'https://i.pravatar.cc/150?u=rhymeschemer', skills: [Skill.Rapping] },
];

export const MOCK_PROJECTS: CollaborationProject[] = [
    {
        id: 201,
        title: 'Seeking Vocalist for Dark Trap Banger',
        description: 'I have a fully produced, hard-hitting trap beat with an 808 that shakes the room. Looking for a female vocalist with a haunting, melodic style for the hook.',
        postedBy: 3,
        requiredSkills: [Skill.Vocals],
    },
    {
        id: 202,
        title: 'Rapper Needed for 5-Track Conscious Hip-Hop EP',
        description: 'Got a collection of soulful, sample-based beats. I need a lyrical rapper who can tell stories and touch on social issues. Think J. Cole meets Nas.',
        postedBy: 1,
        requiredSkills: [Skill.Rapping, Skill.Songwriting],
    },
    {
        id: 203,
        title: 'Producer Collab for Lo-fi Album',
        description: 'I\'m a producer specializing in melodies and samples, but I struggle with drums. Looking for another producer to team up with for a full-length lo-fi project.',
        postedBy: 3,
        requiredSkills: [Skill.Production],
    },
    {
        id: 204,
        title: 'Mixing Engineer for Pop-Rap Single',
        description: 'My new track is almost there, but the mix sounds muddy. I need an experienced engineer to make the vocals pop and the bass hit just right. Fast turnaround needed!',
        postedBy: 2,
        requiredSkills: [Skill.Mixing],
    },
    {
        id: 205,
        title: 'Need a Hook Writer for Summer Anthem',
        description: 'The verses are fire, the beat is infectious, but I can\'t nail the hook. Looking for a talented songwriter to help create a catchy, memorable chorus.',
        postedBy: 5,
        requiredSkills: [Skill.Songwriting, Skill.Vocals],
    },
    {
        id: 206,
        title: 'Full Production for an Aspiring Rapper',
        description: 'I\'ve got bars for days but no access to beats or recording equipment. Looking for an all-in-one producer who can help me create a demo from scratch.',
        postedBy: 5,
        requiredSkills: [Skill.Production, Skill.Mixing, Skill.Mastering],
    },
];