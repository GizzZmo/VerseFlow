from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import random

app = FastAPI(title="VerseFlow AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mood / genre / BPM knowledge base
GENRE_PROFILES = {
    "trap": {"moods": ["Hype", "Dark", "Energetic"], "bpm_range": (130, 160), "keys": ["Amin", "Dmin", "Emin"]},
    "lofi": {"moods": ["Chill", "Sad", "Soulful"], "bpm_range": (75, 95), "keys": ["Cmaj", "Gmaj", "Fmaj"]},
    "drill": {"moods": ["Dark", "Energetic", "Hype"], "bpm_range": (140, 150), "keys": ["Gmin", "Dmin", "Bmin"]},
    "boom bap": {"moods": ["Soulful", "Experimental", "Hype"], "bpm_range": (85, 105), "keys": ["Cmaj", "Fmaj", "Amaj"]},
    "rnb": {"moods": ["Soulful", "Chill", "Sad"], "bpm_range": (70, 100), "keys": ["Gmaj", "Cmaj", "Fmaj"]},
    "afrobeats": {"moods": ["Hype", "Energetic", "Soulful"], "bpm_range": (95, 120), "keys": ["Dmaj", "Amaj", "Emaj"]},
    "pop rap": {"moods": ["Hype", "Chill", "Energetic"], "bpm_range": (100, 130), "keys": ["Cmaj", "Gmaj", "Dmaj"]},
    "conscious": {"moods": ["Soulful", "Experimental", "Sad"], "bpm_range": (85, 110), "keys": ["Amin", "Fmaj", "Cmin"]},
}

VIBE_KEYWORDS = {
    "dark": {"moods": ["Dark", "Sad"], "genres": ["trap", "drill"]},
    "chill": {"moods": ["Chill", "Soulful"], "genres": ["lofi", "rnb"]},
    "hype": {"moods": ["Hype", "Energetic"], "genres": ["trap", "afrobeats"]},
    "sad": {"moods": ["Sad", "Chill"], "genres": ["lofi", "rnb"]},
    "angry": {"moods": ["Dark", "Energetic"], "genres": ["drill", "trap"]},
    "love": {"moods": ["Soulful", "Chill"], "genres": ["rnb", "pop rap"]},
    "party": {"moods": ["Hype", "Energetic"], "genres": ["afrobeats", "pop rap"]},
    "conscious": {"moods": ["Soulful", "Experimental"], "genres": ["conscious", "boom bap"]},
    "storytelling": {"moods": ["Soulful", "Experimental"], "genres": ["boom bap", "conscious"]},
    "summer": {"moods": ["Hype", "Chill", "Energetic"], "genres": ["afrobeats", "pop rap"]},
}

ALL_KEYS = ["Cmaj", "Cmin", "Dmaj", "Dmin", "Emaj", "Emin", "Fmaj", "Fmin", "Gmaj", "Gmin", "Amaj", "Amin", "Bmaj", "Bmin"]
ALL_MOODS = ["Hype", "Chill", "Dark", "Sad", "Energetic", "Soulful", "Experimental"]


class BeatSuggestionRequest(BaseModel):
    prompt: str
    genre: Optional[str] = None
    referenceArtist: Optional[str] = None


class BeatSuggestion(BaseModel):
    mood: str
    key: str
    bpm: int
    reasoning: str
    suggestedGenre: str
    referenceArtists: list[str]


def detect_genre_from_prompt(prompt: str) -> Optional[str]:
    prompt_lower = prompt.lower()
    for genre in GENRE_PROFILES:
        if genre in prompt_lower:
            return genre
    return None


def detect_vibe_from_prompt(prompt: str) -> Optional[str]:
    prompt_lower = prompt.lower()
    for vibe, data in VIBE_KEYWORDS.items():
        if vibe in prompt_lower:
            return vibe, data
    return None, {}


ARTIST_GENRE_MAP = {
    "drake": "pop rap",
    "kendrick": "conscious",
    "travis scott": "trap",
    "j cole": "conscious",
    "21 savage": "trap",
    "future": "trap",
    "frank ocean": "rnb",
    "gunna": "trap",
    "lil baby": "trap",
    "pop smoke": "drill",
    "central cee": "drill",
    "burna boy": "afrobeats",
    "wizkid": "afrobeats",
    "nas": "boom bap",
    "jay z": "boom bap",
}


def get_reference_artists_for_genre(genre: str) -> list[str]:
    return [artist for artist, g in ARTIST_GENRE_MAP.items() if g == genre][:3]


@app.post("/ai/suggest_beat/", response_model=dict)
async def suggest_beat(request: BeatSuggestionRequest):
    prompt = request.prompt.lower()
    genre = request.genre

    # Determine genre from various sources
    if not genre and request.referenceArtist:
        genre = ARTIST_GENRE_MAP.get(request.referenceArtist.lower())

    if not genre:
        genre = detect_genre_from_prompt(prompt)

    vibe_name, vibe_data = detect_vibe_from_prompt(prompt)

    if not genre and vibe_data.get("genres"):
        genre = vibe_data["genres"][0]

    if not genre:
        genre = random.choice(list(GENRE_PROFILES.keys()))

    profile = GENRE_PROFILES.get(genre, GENRE_PROFILES["boom bap"])
    bpm_min, bpm_max = profile["bpm_range"]

    # Pick mood: prefer vibe match, else genre default
    if vibe_data.get("moods"):
        mood = random.choice(vibe_data["moods"])
    else:
        mood = random.choice(profile["moods"])

    key = random.choice(profile["keys"]) if profile["keys"] else random.choice(ALL_KEYS)
    bpm = random.randint(bpm_min, bpm_max)
    reference_artists = get_reference_artists_for_genre(genre)

    reasoning = (
        f"Based on a \"{vibe_name or 'general'}\" vibe with {genre} influences, "
        f"a {mood.lower()} {key} beat at {bpm} BPM fits the energy."
    )

    return {
        "suggestion": {
            "mood": mood,
            "key": key,
            "bpm": bpm,
            "reasoning": reasoning,
            "suggestedGenre": genre,
            "referenceArtists": reference_artists,
        }
    }


class CollabMatchRequest(BaseModel):
    skills: list[str]
    projectDescription: str
    preferredGenres: Optional[list[str]] = None


@app.post("/ai/match_collaborators/")
async def match_collaborators(request: CollabMatchRequest):
    """
    Suggests collaboration roles and tips based on skills and project description.
    """
    desc_lower = request.projectDescription.lower()
    suggestions = []

    skill_roles = {
        "Rapping": "featured rapper or co-writer",
        "Vocals": "hook vocalist or background vocalist",
        "Production": "beat producer or co-producer",
        "Mixing": "mixing engineer",
        "Mastering": "mastering engineer",
        "Songwriting": "co-writer or topline writer",
    }

    for skill in request.skills:
        role = skill_roles.get(skill, skill)
        suggestions.append({
            "skill": skill,
            "role": role,
            "tip": f"Look for a {role} who specializes in the genre/vibe you described."
        })

    detected_genre = detect_genre_from_prompt(desc_lower) or "hip-hop"

    return {
        "suggestions": suggestions,
        "detectedGenre": detected_genre,
        "collaborationTip": (
            f"For a {detected_genre} project, focus on locking in your producer and vocalist first — "
            "they shape the overall direction."
        )
    }


@app.get("/health")
async def health():
    return {"status": "ok", "service": "VerseFlow AI", "version": "1.0.0"}
