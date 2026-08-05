# 🎵 VerseFlow

> The definitive digital launchpad for independent rap artists — featuring AI-powered beat discovery, artist collaboration, and career-building tools in one integrated ecosystem.

[![CI/CD Pipeline](https://github.com/GizzZmo/VerseFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/GizzZmo/VerseFlow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 8.0.0 or higher (included with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Gemini API Key** for AI features ([Get one free](https://makersuite.google.com/))
- **Python 3.12+** for the AI service ([Download](https://www.python.org/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GizzZmo/VerseFlow.git
   cd VerseFlow
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** at [http://localhost:5173](http://localhost:5173)

🎉 VerseFlow is now running locally!

---

## 📦 Project Structure

```
VerseFlow/
├── .github/                 # GitHub Actions workflows and templates
├── ai_service/              # FastAPI Python AI service (port 8001)
│   └── main.py              # Beat suggestion AI endpoint
├── components/              # React frontend components
│   ├── ui/                  # Reusable UI primitives
│   ├── AudioPlayer.tsx      # Music playback component
│   ├── BeatExchange.tsx     # Beat discovery marketplace
│   ├── CollaborationHub.tsx # Artist collaboration (The Cypher)
│   └── Header.tsx           # Application header and navigation
├── contexts/                # React context providers
│   └── UserContext.tsx      # Global user state management
├── docs/                    # Project documentation
├── hooks/                   # Custom React hooks
├── services/                # Frontend API service layer
├── src/                     # Express.js backend
│   ├── routes/              # API route handlers
│   ├── middleware/          # Express middleware (auth, etc.)
│   └── app.ts               # Express app configuration
├── utils/                   # Shared utility functions
├── types.ts                 # TypeScript type definitions
├── constants.ts             # Application constants and mock data
├── App.tsx                  # Main React application component
├── index.tsx                # Application entry point
├── package.json             # Node.js dependencies and npm scripts
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript config (frontend)
└── tsconfig.server.json     # TypeScript config (backend)
```

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start frontend dev server (http://localhost:5173)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview the production build (http://localhost:4173)
npm run lint         # Run ESLint on TypeScript/TSX files
npm run type-check   # Run TypeScript type checking
```

---

## 🤖 AI Service (Python)

The AI beat suggestion service runs separately as a FastAPI app:

```bash
# Install Python dependencies
pip3 install fastapi uvicorn

# Start the AI service on port 8001
cd ai_service
python3 -m uvicorn main:app --reload --port 8001

# Test it
curl -X POST http://127.0.0.1:8001/ai/suggest_beat/ \
  -H "Content-Type: application/json" \
  -d '{"prompt": "chill vibes"}'
# Returns: {"suggestion":{"mood":"Chill","key":"Am","bpm":85}}
```

---

## 🌐 Service Ports

| Service         | Port  | Command                        |
|----------------|-------|--------------------------------|
| Frontend (dev) | 5173  | `npm run dev`                  |
| Frontend (preview) | 4173 | `npm run preview`           |
| Backend API    | 3001  | Express.js (see `server.ts`)   |
| AI Service     | 8001  | `uvicorn main:app --port 8001` |

---

## ✨ Key Features

### For Artists
- **Beat Exchange** — Browse and license beats by mood, BPM, key, and genre
- **The Cypher (Collaboration Hub)** — Post and apply for collaboration projects
- **AI Beat Suggestions** — Get personalized beat recommendations
- **Distribution** — One-click distribution to 150+ streaming services
- **Monetization** — Fan subscriptions, merch shelf, and tip jar
- **Analytics Dashboard** — Track streams, revenue, and audience growth

### For Fans
- **FlowState Radio** — Personalized discovery algorithm
- **Curated Charts** — Regional and sub-genre playlists
- **Fan Clubs** — Connect with artists and fellow fans
- **Direct Support** — Subscriptions, tips, and merch

---

## 🔧 Environment Variables

Create a `.env.local` file (copy `.env.example`):

```env
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Quick Start Guide](docs/Quick-Start-Guide.md) | Detailed setup walkthrough |
| [Architecture Overview](docs/Architecture-Overview.md) | System design and tech stack |
| [API Documentation](docs/API-Documentation.md) | Backend API reference |
| [Platform Vision](docs/Platform-Vision.md) | Product roadmap and goals |
| [FAQ](docs/FAQ.md) | Common questions and answers |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [SECURITY.md](SECURITY.md) | Security policy |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [CI/CD Docs](CI_CD_DOCS.md) | Pipeline documentation |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| AI Service | Python 3.12+, FastAPI, Google Gemini |
| Build Tool | Vite |
| Linting | ESLint, TypeScript ESLint |
| CI/CD | GitHub Actions |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🌐 Platform Vision

VerseFlow's mission is to dismantle the barriers to entry in the music industry by providing emerging rap artists with a powerful, all-in-one suite of tools for creation, distribution, monetization, and community engagement.

Read the full vision in [docs/Platform-Vision.md](docs/Platform-Vision.md).

---

<div align="center">
  <strong>Built for independent artists. Powered by community. 🎤</strong><br/>
  <a href="https://github.com/GizzZmo/VerseFlow/issues">Report a Bug</a> ·
  <a href="https://github.com/GizzZmo/VerseFlow/discussions">Request a Feature</a> ·
  <a href="docs/Quick-Start-Guide.md">Get Started</a>
</div>
