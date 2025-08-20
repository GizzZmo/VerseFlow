# Quick Start Guide

Get up and running with VerseFlow in minutes! This guide will help you set up the development environment and start exploring the platform.

## 🎯 What You'll Learn

- How to set up VerseFlow locally
- How to configure AI features
- How to navigate the platform
- How to start contributing

## ⚡ Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended
- **Gemini API Key** - [Get one here](https://makersuite.google.com/)

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version   # Should be 8.0.0 or higher

# Check Git version
git --version   # Any recent version
```

## 🚀 5-Minute Setup

### 1. Clone the Repository

```bash
git clone https://github.com/GizzZmo/VerseFlow.git
cd VerseFlow
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages. You should see output like:
```
added 173 packages in 10s
```

### 3. Configure Environment

Create your environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
# Required for AI features
GEMINI_API_KEY=your_api_key_here

# Optional - for SoundCloud integration
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
```

> 💡 **Tip**: You can get a free Gemini API key from [Google AI Studio](https://makersuite.google.com/)

### 4. Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v6.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. Open VerseFlow

Open your browser and navigate to:
```
http://localhost:5173
```

🎉 **Congratulations!** VerseFlow is now running locally!

## 🎵 First Steps

### Explore the Beat Exchange

1. **Browse Beats**: The main page shows available beats
2. **Use Filters**: Try filtering by mood, BPM, or key
3. **Preview Audio**: Click play buttons to preview beats
4. **Check AI Suggestions**: See personalized recommendations

### Try The Cypher (Collaboration Hub)

1. **Navigate**: Click "The Cypher" in the top navigation
2. **Browse Projects**: See collaboration opportunities
3. **View Profiles**: Check out artist and producer profiles
4. **Post a Project**: Click "Post a New Project" (login required)

### Test User Features

1. **Login**: Click "Login" and try the SoundCloud demo
2. **Favorites**: Heart beats to add them to favorites
3. **Profile**: View your profile and skills
4. **Notifications**: Check the notification center

## 🛠️ Development Workflow

### Project Structure

```
VerseFlow/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── BeatExchange.tsx
│   ├── CollaborationHub.tsx
│   └── ...
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── src/                # Backend code
│   └── routes/         # API endpoints
├── types.ts            # TypeScript definitions
├── utils/              # Utility functions
└── docs/               # Documentation
```

### Key Files to Know

- `App.tsx` - Main application component
- `types.ts` - TypeScript type definitions
- `constants.ts` - Application constants
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies and scripts

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality (when configured)
npm run lint         # Run linting
npm run test         # Run tests
npm run type-check   # TypeScript checking
```

## 🔧 Common Tasks

### Adding a New Component

1. Create component file in appropriate directory:
```typescript
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-white text-xl">{title}</h2>
    </div>
  );
};

export default MyComponent;
```

2. Export from index file (if using barrel exports):
```typescript
// components/index.ts
export { default as MyComponent } from './MyComponent';
```

3. Use in other components:
```typescript
import { MyComponent } from '../components';

// In render:
<MyComponent title="Hello World" />
```

### Adding a New API Endpoint

1. Create route handler:
```typescript
// src/routes/myRoute.ts
import { Router } from 'express';

const router = Router();

router.get('/my-endpoint', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

export default router;
```

2. Register route in main server:
```typescript
// server.ts
import myRoute from './src/routes/myRoute';

app.use('/api', myRoute);
```

### Adding a Custom Hook

1. Create hook file:
```typescript
// hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export const useMyHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    // Hook logic here
  }, []);
  
  return { value, setValue };
};
```

2. Use in components:
```typescript
import { useMyHook } from '../hooks/useMyHook';

const MyComponent = () => {
  const { value, setValue } = useMyHook('initial');
  // Component logic
};
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
Error: listen EADDRINUSE: address already in use :::5173
```

**Solution**: Kill the process or use a different port:
```bash
# Kill process on port 5173
npx kill-port 5173

# Or start on different port
npm run dev -- --port 3000
```

#### Module Not Found
```bash
Error: Cannot resolve module './components/MyComponent'
```

**Solutions**:
- Check file path spelling
- Ensure file extension is correct
- Check if file exists
- Restart development server

#### TypeScript Errors
```bash
TS2307: Cannot find module './types'
```

**Solutions**:
- Check import paths
- Ensure types are exported correctly
- Run `npm run type-check` for details
- Restart TypeScript language server in IDE

#### API Key Issues
```bash
Error: API key not found
```

**Solutions**:
- Check `.env.local` file exists
- Verify API key format
- Restart development server after adding key
- Check console for specific error messages

### Getting Help

If you encounter issues:

1. **Check the logs** in your terminal and browser console
2. **Search existing issues** on GitHub
3. **Check documentation** in the `docs/` folder
4. **Ask for help** in GitHub Discussions
5. **Report bugs** via GitHub Issues

## 🎯 Next Steps

### For Users
- Explore all features in the Beat Exchange
- Try posting a collaboration project
- Connect with other users
- Customize your profile

### For Contributors
- Read the [Contributing Guide](../CONTRIBUTING.md)
- Check the [Architecture Overview](Architecture-Overview.md)
- Look at open issues for contribution opportunities
- Join community discussions

### For Developers
- Study the [API Documentation](API-Documentation.md)
- Understand the component architecture
- Set up testing environment
- Configure deployment pipeline

## 📚 Additional Resources

### Documentation
- [README.md](../README.md) - Project overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [Architecture Overview](Architecture-Overview.md) - System design
- [API Documentation](API-Documentation.md) - API reference

### External Resources
- [React Documentation](https://react.dev/) - React framework
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Vite Guide](https://vitejs.dev/guide/) - Build tool documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework

### Community
- [GitHub Repository](https://github.com/GizzZmo/VerseFlow)
- [GitHub Issues](https://github.com/GizzZmo/VerseFlow/issues)
- [GitHub Discussions](https://github.com/GizzZmo/VerseFlow/discussions)

## ✅ Checklist

Make sure you've completed these steps:

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Environment configured (`.env.local`)
- [ ] Development server started (`npm run dev`)
- [ ] Application accessible at `http://localhost:5173`
- [ ] Basic features tested (beat browsing, navigation)
- [ ] AI features working (with API key)

---

🎵 **You're ready to start exploring VerseFlow!** Whether you're a user, contributor, or developer, you now have everything you need to get started. Welcome to the community!

If you have any questions, don't hesitate to reach out through our community channels. Happy coding and music making! 🚀