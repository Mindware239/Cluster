import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'POS Admin Multi-Tenant API is running',
    timestamp: new Date().toISOString(),
    version: API_VERSION
  });
});

// Basic API routes
app.get(`/api/${API_VERSION}`, (_req, res) => {
  res.json({ 
    message: 'POS Admin Multi-Tenant API',
    version: API_VERSION,
    status: 'running'
  });
});

// Test database connection endpoint
app.get('/api/test-db', async (_req, res) => {
  try {
    // For now, just return a success message
    // Database connection will be implemented later
    res.json({ 
      message: 'Database connection test endpoint',
      status: 'Database connection will be implemented in the next phase'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/${API_VERSION}`);
  console.log(`🔍 Health check at http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'Not configured'}`);
});

export { app };
