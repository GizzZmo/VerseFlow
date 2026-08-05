import express from 'express';
import cors from 'cors';
import path from 'path';
import app from './src/app';

const PORT = process.env.PORT || 3001;
const server = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://your-domain.com']
  : ['http://localhost:5173', 'http://localhost:4173'];

// Enable CORS for frontend
server.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Health check (unauthenticated)
server.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'VerseFlow API', version: '1.0.0' });
});

// Mount the versioned API routes
server.use('/api', app);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  server.use(express.static(path.join(__dirname, 'dist')));

  server.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 VerseFlow backend server running on port ${PORT}`);
  console.log(`📊 API v1 available at http://localhost:${PORT}/api/v1`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

export default server;
