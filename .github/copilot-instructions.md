# VerseFlow Development Instructions

VerseFlow is a digital ecosystem for independent rap artists featuring AI-powered beat discovery and artist collaboration. The platform includes a React frontend, Express.js backend, and FastAPI AI service.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites
- Node.js v18.0.0 or higher (verified working on v20.19.4)
- npm 8.0.0 or higher (verified working on v10.8.2)
- Python 3.12+ for AI service
- Git for version control

### Bootstrap and Build Process
Execute these commands in order - **NEVER CANCEL** any build operation:

```bash
# 1. Install Node.js dependencies (~10-15 seconds)
npm install

# 2. Type checking (fails with known errors, ~1 second)
npm run type-check
# EXPECTED: TypeScript compilation errors in src/components/UNDashboard.tsx and missing React imports

# 3. Build for production (~1.5 seconds) - NEVER CANCEL, set timeout to 30+ seconds
npm run build
# SUCCEEDS despite TypeScript errors due to Vite's error handling

# 4. Install linting tools (if not already installed, ~10-15 seconds)
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin @eslint/js

# 5. Run linting (~2-3 seconds) - EXPECT 289 errors/warnings
npm run lint
# EXPECTED: 256 errors, 33 warnings - mostly missing React imports and DOM type definitions
```

### Development Servers

#### Frontend Development Server
```bash
# Start React frontend on localhost:5173 (~200ms startup)
npm run dev
# EXPECT: "VITE v6.3.5 ready in 185-200ms" message
# ACCESS: http://localhost:5173/
# CURRENT STATE: Loads with runtime errors due to missing React imports
```

#### Backend API Server
**NOTE**: Backend server exists but lacks proper startup script configuration.
```bash
# Manual backend startup (requires ts-node configuration fixes)
npx ts-node --project tsconfig.server.json server.ts
# CURRENT STATE: Fails due to ES module configuration issues
# WORKAROUND: Backend API routes exist in src/routes/ but need proper startup script
```

#### AI Service (Python FastAPI)
```bash
# Install Python dependencies first
pip3 install fastapi uvicorn

# Start AI service on localhost:8001 (~1-2 seconds)
cd ai_service
python3 -m uvicorn main:app --reload --port 8001
# EXPECT: "Uvicorn running on http://127.0.0.1:8001" message

# Test AI service endpoint
curl -X POST http://127.0.0.1:8001/ai/suggest_beat/ \
  -H "Content-Type: application/json" \
  -d '{"prompt": "chill vibes"}'
# EXPECT: {"suggestion":{"mood":"Chill","key":"Am","bpm":85}}
```

### Production Build and Preview
```bash
# Build production bundle (~1.5 seconds) - NEVER CANCEL, set timeout to 30+ seconds
npm run build

# Preview production build (starts preview server on localhost:4173)
npm run preview
# ACCESS: http://localhost:4173/
```

## Validation Scenarios

**CRITICAL**: Always test these scenarios after making changes:

### Frontend Validation
1. **Development Server Test**:
   - Run `npm run dev`
   - Navigate to http://localhost:5173/
   - Verify page loads (currently shows runtime errors due to missing React imports)
   - Check browser console for error details

2. **Build Validation**:
   - Run `npm run build` - NEVER CANCEL, wait for completion
   - Verify dist/ directory is created with bundled assets
   - Run `npm run preview` to test production build

3. **Component Testing**:
   - Navigate through Beat Exchange, Collaboration Hub, and Favorites sections
   - Test audio player functionality (currently limited due to runtime errors)

### Backend Validation
1. **API Route Testing**:
   - Review src/routes/ directory for available endpoints
   - Verify Express.js route structure in src/app.ts
   - Test authentication middleware in src/middleware/auth.ts

### AI Service Validation
1. **Service Availability**:
   - Start AI service with uvicorn command
   - Test beat suggestion endpoint with curl command above
   - Verify JSON response structure

## Known Issues and Current State

### Build and Runtime Issues
- **TypeScript Compilation**: Fails with errors in UNDashboard.tsx line 2 (expression expected)
- **Missing React Imports**: App.tsx and other components missing React, useState, useCallback imports
- **Runtime Errors**: Frontend loads but has UserProvider and React hook errors
- **Backend Startup**: Express server needs proper startup script configuration
- **Linting**: 289 ESLint issues (256 errors, 33 warnings) mostly from missing imports

### Working Components
- ✅ Vite build system (builds successfully despite TS errors)
- ✅ Package installation and dependency management
- ✅ AI service (FastAPI working correctly)
- ✅ Project structure and component organization
- ✅ Express.js backend architecture (routes defined)

### CI/CD Pipeline State
- **Status**: Configured with `continue-on-error: true` for known build failures
- **Triggers**: Push/PR to main/develop branches
- **Tests**: No test framework currently configured
- **Deployment**: Placeholder configuration exists in .github/workflows/ci.yml

## Project Structure and Navigation

### Key Directories
```
VerseFlow/
├── .github/                 # GitHub Actions and templates
├── ai_service/             # FastAPI Python AI service
│   └── main.py            # AI beat suggestion endpoint
├── components/             # React components (frontend)
│   ├── ui/                # Reusable UI components
│   ├── AudioPlayer.tsx    # Music player component
│   ├── BeatExchange.tsx   # Main beat discovery interface
│   ├── CollaborationHub.tsx # Artist collaboration features
│   └── Header.tsx         # Application header
├── contexts/              # React context providers
│   └── UserContext.tsx    # User state management
├── docs/                  # Documentation
│   ├── Quick-Start-Guide.md
│   ├── API-Documentation.md
│   └── Architecture-Overview.md
├── hooks/                 # Custom React hooks
├── services/              # Frontend service layer
├── src/                   # Backend code (Express.js)
│   ├── routes/           # API endpoints
│   ├── middleware/       # Express middleware
│   └── app.ts           # Express app configuration
├── utils/                # Utility functions
├── types.ts              # TypeScript type definitions
├── constants.ts          # Application constants
├── package.json          # Node.js dependencies and scripts
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript configuration (frontend)
└── tsconfig.server.json  # TypeScript configuration (backend)
```

### Key Files to Know
- **App.tsx**: Main application component (currently has import issues)
- **types.ts**: TypeScript definitions for Beat, User, etc.
- **constants.ts**: Mock data for development
- **vite.config.ts**: Build configuration with environment variable handling
- **server.ts**: Express.js server entry point
- **package.json**: Available npm scripts and dependencies

### Frequently Used Commands
```bash
# Development workflow
npm install                 # Install dependencies
npm run dev                # Start frontend dev server
npm run build              # Build for production
npm run type-check         # TypeScript checking
npm run lint               # Code linting (shows current issues)

# Testing and validation
npm run preview            # Preview production build
curl http://localhost:5173/  # Test frontend availability
curl -X POST http://127.0.0.1:8001/ai/suggest_beat/ -H "Content-Type: application/json" -d '{"prompt":"test"}'  # Test AI service
```

## Common Tasks and Solutions

### When Adding New Components
1. Create component in `components/` directory
2. Follow existing TypeScript patterns in other components
3. Import React hooks properly (currently missing in existing files)
4. Run `npm run type-check` to verify TypeScript
5. Test in development server with `npm run dev`

### When Modifying API Routes
1. Update routes in `src/routes/` directory
2. Modify `src/app.ts` if adding new route modules
3. Test backend functionality (currently needs startup script fixes)
4. Update API documentation in `docs/API-Documentation.md`

### When Working with AI Features
1. Start AI service: `cd ai_service && python3 -m uvicorn main:app --reload --port 8001`
2. Test endpoints with curl commands
3. Modify `ai_service/main.py` for new AI functionality
4. Ensure frontend services integrate with AI endpoints

### Before Committing Changes
1. **ALWAYS** run `npm run build` and wait for completion - NEVER CANCEL
2. **ALWAYS** run `npm run lint` to check for new issues
3. **ALWAYS** test development server functionality
4. Verify CI pipeline compatibility (.github/workflows/ci.yml)

## Environment Configuration

### Required Environment Variables
Create `.env.local` file (copy from `.env.example`):
```bash
# Gemini API Key for AI features
GEMINI_API_KEY=your_api_key_here
```

### Port Configuration
- **Frontend Dev**: localhost:5173 (Vite)
- **Frontend Preview**: localhost:4173 (Vite preview)
- **Backend API**: localhost:3001 (Express.js, when properly configured)
- **AI Service**: localhost:8001 (FastAPI)

## Timeout and Performance Guidelines

**CRITICAL - NEVER CANCEL**: All timing recommendations include safety buffers:

- **npm install**: 30 seconds timeout (typically completes in 10-15s)
- **npm run build**: 30 seconds timeout (typically completes in 1-2s)
- **npm run type-check**: 15 seconds timeout (typically completes in 1s)
- **npm run lint**: 30 seconds timeout (typically completes in 2-3s)
- **Development servers**: Start within 5 seconds, set 15-second timeout for startup

**NEVER CANCEL long-running commands.** The build and development tools are designed to complete successfully even with current known issues.