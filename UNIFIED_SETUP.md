# 🚀 Unified Port Setup Guide

## Overview
This project now supports running both frontend and backend on the same port (3000) for production, while maintaining separate ports during development for hot reload capabilities.

## 🏗️ Architecture

### Development Mode
- **Backend**: Port 3000 (API routes: `/api/*`)
- **Frontend**: Port 3001 (with proxy to backend for API calls)
- **Hot Reload**: Both frontend and backend support live reloading

### Production Mode
- **Unified Port**: Port 3000
- **Backend**: Serves API routes (`/api/*`)
- **Frontend**: Serves static files and handles all other routes
- **Single Build**: One command to build and start everything

## 📋 Available Scripts

### Development
```bash
# Run both frontend and backend in separate ports (recommended for development)
npm run dev

# Run only backend
npm run dev:backend

# Run only frontend
npm run dev:frontend

# Run unified mode (backend serves frontend build)
npm run dev:unified
```

### Production
```bash
# Build both frontend and backend
npm run build

# Start production server
npm start

# Start development server (for testing)
npm run start:dev
```

## 🔧 Configuration Files

### Backend (`src/backend/index.ts`)
- Automatically detects environment
- Serves static files in production
- Handles React Router fallback
- API routes under `/api/*`

### Frontend (`frontend/vite.config.ts`)
- Development proxy to backend
- Production build optimization
- Source maps for debugging

### Build Script (`scripts/build.js`)
- Windows and Unix compatible
- Automatic cleanup
- Copies frontend build to backend dist

## 🌐 URL Structure

### Development
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/health

### Production
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/health

## 🚀 Quick Start

### 1. Development (Recommended)
```bash
npm run dev
```
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Hot reload enabled for both

### 2. Production Build
```bash
npm run build
npm start
```
- Everything runs on port 3000
- Frontend and backend unified

### 3. Unified Development (Testing Production Setup)
```bash
npm run dev:unified
```
- Frontend build served by backend
- Single port (3000)
- Good for testing production behavior

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Kill processes on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build Issues
```bash
# Clean and rebuild
rm -rf dist frontend/dist
npm run build
```

### Frontend Not Loading
- Check if backend is running
- Verify frontend build exists in `dist/frontend/`
- Check browser console for errors

## 📁 File Structure After Build
```
dist/
├── index.js              # Backend entry point
├── frontend/             # Frontend build files
│   ├── index.html
│   ├── assets/
│   └── ...
└── ...                   # Other backend files
```

## 🎯 Best Practices

1. **Development**: Use `npm run dev` for hot reload
2. **Testing**: Use `npm run dev:unified` to test production setup
3. **Production**: Use `npm run build && npm start`
4. **Environment**: Set `NODE_ENV=production` for production builds
5. **Ports**: Backend always uses port 3000, frontend dev uses 3001

## 🔄 Migration from Old Setup

If you were using the old separate port setup:
1. Your existing code will continue to work
2. API calls will still work as expected
3. Frontend routing will work in production
4. Development workflow remains the same

## 📚 Additional Resources

- [Express.js Static File Serving](https://expressjs.com/en/starter/static-files.html)
- [Vite Configuration](https://vitejs.dev/config/)
- [React Router with Express](https://reactrouter.com/en/main)
