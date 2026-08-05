import { CollaborationRequest, Message, ArtistProfile } from '../types';
import { MOCK_TALENT_PROFILES } from '../constants';

const API_BASE = 'http://localhost:3001/api/v1';

// ---------------------------------------------------------------------------
// Mock state (in-memory, persists for the session until page reload)
// ---------------------------------------------------------------------------
let mockRequests: CollaborationRequest[] = [];
let mockMessages: Message[] = [];
let nextId = 1000;

const getMockArtistProfiles = (): ArtistProfile[] =>
  MOCK_TALENT_PROFILES.map(p => ({
    ...p,
    bio: `${p.name} is a talented ${p.skills.join(' & ')} artist based in the community.`,
    genres: ['Hip-hop', 'R&B'],
    openToCollaboration: true,
    connections: [],
    projectsPosted: [],
  }));

// ---------------------------------------------------------------------------
// Artist profiles
// ---------------------------------------------------------------------------

export const getArtistProfiles = async (): Promise<ArtistProfile[]> => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    return getMockArtistProfiles();
  }
};

export const getArtistProfile = async (userId: number): Promise<ArtistProfile | null> => {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    return getMockArtistProfiles().find(p => p.id === userId) ?? null;
  }
};

// ---------------------------------------------------------------------------
// Collaboration requests
// ---------------------------------------------------------------------------

export const sendCollaborationRequest = async (
  fromUserId: number,
  toUserId: number,
  message: string,
  projectId?: number
): Promise<CollaborationRequest> => {
  const request: CollaborationRequest = {
    id: ++nextId,
    fromUserId,
    toUserId,
    projectId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE}/collaborations/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    mockRequests.push(request);
    return request;
  }
};

export const getCollaborationRequests = async (
  userId: number
): Promise<CollaborationRequest[]> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations/requests?userId=${userId}`);
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    return mockRequests.filter(
      r => r.fromUserId === userId || r.toUserId === userId
    );
  }
};

export const respondToRequest = async (
  requestId: number,
  status: 'accepted' | 'declined'
): Promise<CollaborationRequest | null> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations/requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    const req = mockRequests.find(r => r.id === requestId);
    if (req) req.status = status;
    return req ?? null;
  }
};

// ---------------------------------------------------------------------------
// Direct messages
// ---------------------------------------------------------------------------

export const sendMessage = async (
  fromUserId: number,
  toUserId: number,
  content: string
): Promise<Message> => {
  const message: Message = {
    id: ++nextId,
    fromUserId,
    toUserId,
    content,
    createdAt: new Date().toISOString(),
    read: false,
  };

  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    mockMessages.push(message);
    return message;
  }
};

export const getMessages = async (
  userId: number,
  otherUserId: number
): Promise<Message[]> => {
  try {
    const res = await fetch(
      `${API_BASE}/messages?userId=${userId}&otherUserId=${otherUserId}`
    );
    if (!res.ok) throw new Error('API unavailable');
    return res.json();
  } catch {
    return mockMessages.filter(
      m =>
        (m.fromUserId === userId && m.toUserId === otherUserId) ||
        (m.fromUserId === otherUserId && m.toUserId === userId)
    );
  }
};

// ---------------------------------------------------------------------------
// AI-powered collaborator matching
// ---------------------------------------------------------------------------

export const getAiCollabMatch = async (
  skills: string[],
  projectDescription: string
): Promise<{ suggestions: { skill: string; role: string; tip: string }[]; detectedGenre: string; collaborationTip: string } | null> => {
  try {
    const res = await fetch('http://localhost:8001/ai/match_collaborators/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, projectDescription }),
    });
    if (!res.ok) throw new Error('AI service unavailable');
    return res.json();
  } catch {
    return {
      suggestions: skills.map(skill => ({
        skill,
        role: skill.toLowerCase(),
        tip: `Look for someone specializing in ${skill.toLowerCase()}.`,
      })),
      detectedGenre: 'hip-hop',
      collaborationTip: 'Start with your producer and vocalist to set the direction.',
    };
  }
};
