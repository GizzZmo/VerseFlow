# VerseFlow: Beat Exchange

<div align="center">
  <img width="1200" height="475" alt="VerseFlow Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<div align="center">
  <h3>🎵 The Digital Ecosystem for Independent Rap Artists 🎵</h3>
  <p>Discover, collaborate, and create with AI-powered music tools</p>
</div>

---

## 🌟 Overview

VerseFlow is a comprehensive digital platform designed specifically for independent rap artists, producers, and music creators. It combines beat discovery, artist collaboration, and AI-powered music tools in one seamless experience.

### 🎯 Core Features

- **🎧 Beat Exchange**: AI-powered marketplace for discovering and licensing beats
- **🤝 The Cypher**: Collaboration hub connecting artists, producers, and writers
- **❤️ Favorites System**: Personal collection management for beats and projects
- **🔄 Real-time Audio Player**: Seamless music playback with controls
- **🔔 Smart Notifications**: Stay updated on collaborations and opportunities
- **🤖 AI Suggestions**: Get personalized beat recommendations using Google Gemini AI

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GizzZmo/VerseFlow.git
   cd VerseFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > 🔑 Get your Gemini API key from [Google AI Studio](https://ai.studio)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see VerseFlow in action!

## 🏗️ Project Structure

```
VerseFlow/
├── components/           # React UI components
│   ├── ui/              # Reusable UI components (modals, buttons, etc.)
│   ├── BeatExchange.tsx # Beat marketplace interface
│   ├── CollaborationHub.tsx # Artist collaboration platform
│   └── ...              # Other feature components
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── services/            # External service integrations
│   ├── geminiService.ts # AI recommendations
│   ├── soundcloudService.ts # Music streaming
│   └── authService.ts   # Authentication
├── src/                 # Backend API server
│   ├── routes/          # Express.js API routes
│   ├── middleware/      # Server middleware
│   └── services/        # Server-side services
├── utils/               # Utility functions and constants
└── types.ts            # TypeScript type definitions
```

## 🎨 Key Components

### Beat Exchange
- Browse beats from producers worldwide
- Filter by BPM, key, mood, and genre
- Preview beats with built-in audio player
- License beats (lease or exclusive options)
- AI-powered beat recommendations

### The Cypher (Collaboration Hub)
- Post collaboration projects
- Find artists by skills (rapping, vocals, production, mixing, mastering, songwriting)
- Browse available opportunities
- Connect with like-minded creators

### User Experience
- Seamless authentication with SoundCloud integration
- Personal favorites and collection management
- Real-time notifications system
- Responsive design for all devices

## 🤖 AI Integration

VerseFlow leverages **Google Gemini AI** to provide:
- Personalized beat recommendations based on user preferences
- Smart matching for collaboration opportunities
- Content suggestion and discovery enhancement

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling (via utility classes)
- **FontAwesome** for icons

### Backend
- **Express.js** with TypeScript
- **REST API** architecture
- **CORS** enabled for cross-origin requests
- **Custom middleware** for authentication and validation

### External Services
- **Google Gemini AI** for intelligent recommendations
- **SoundCloud API** for music streaming and discovery
- **Mock data services** for development and testing

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (frontend + backend)
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 🌐 API Endpoints

### Projects
- `GET /api/projects` - List collaboration projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications/read-all` - Mark all as read

### Users
- Authentication and user management endpoints

## 🎵 Music Integration

VerseFlow integrates with various music services to provide a rich audio experience:

- **SoundCloud API**: Stream and discover tracks
- **Beat Licensing**: Lease and exclusive purchase options
- **Audio Player**: Custom-built player with play/pause, progress tracking
- **Favorites System**: Save and organize preferred beats

## 🎨 Design System

VerseFlow features a consistent design system with:
- **Dark theme** optimized for music creation environments
- **Purple accent colors** for brand consistency
- **Responsive grid layouts** for various screen sizes
- **Smooth animations** and transitions
- **Accessible UI components** following best practices

## 🔒 Security & Privacy

- Secure API key management
- User data protection
- Safe external service integration
- Input validation and sanitization

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on:
- Development setup
- Coding standards
- Pull request process
- Issue reporting

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering our recommendation engine
- **SoundCloud** for music streaming capabilities
- **React community** for excellent tooling and libraries
- **Independent artists** who inspire this platform

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/GizzZmo/VerseFlow/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/GizzZmo/VerseFlow/discussions)
- 📧 **Contact**: Reach out through GitHub

---

<div align="center">
  <p>Built with ❤️ for the independent music community</p>
  <p>© 2024 VerseFlow. All rights reserved.</p>
</div>
