import express from 'express';
import cors from 'cors';
import path from 'path';
import app from './src/app';

const PORT = process.env.PORT || 3001;
const server = express();

// Enable CORS for frontend
server.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:5173',
  credentials: true
}));

// Mount the API routes
server.use('/api', app);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  server.use(express.static(path.join(__dirname, 'dist')));
  
  server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 VerseFlow backend server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

export default server;