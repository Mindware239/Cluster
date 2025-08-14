#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️  Starting build process...');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  if (fs.existsSync('frontend/dist')) {
    fs.rmSync('frontend/dist', { recursive: true, force: true });
  }

  // Build frontend
  console.log('⚛️  Building frontend...');
  execSync('cd frontend && npm run build', { stdio: 'inherit', shell: true });

  // Build backend
  console.log('🔧 Building backend...');
  execSync('npm run build:backend', { stdio: 'inherit', shell: true });

  // Copy frontend build to backend dist
  console.log('📁 Copying frontend build to backend...');
  const frontendDist = path.join(__dirname, '../frontend/dist');
  const backendDist = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(backendDist)) {
    fs.mkdirSync(backendDist, { recursive: true });
  }

  // Copy frontend files to backend dist/frontend
  const frontendInBackend = path.join(backendDist, 'frontend');
  if (!fs.existsSync(frontendInBackend)) {
    fs.mkdirSync(frontendInBackend, { recursive: true });
  }

  // Use Windows-compatible copy command
  const isWindows = process.platform === 'win32';
  if (isWindows) {
    execSync(`xcopy "${frontendDist}" "${frontendInBackend}" /E /I /Y`, { stdio: 'inherit', shell: true });
  } else {
    execSync(`cp -r "${frontendDist}/"* "${frontendInBackend}/"`, { stdio: 'inherit', shell: true });
  }

  console.log('✅ Build completed successfully!');
  console.log('🚀 Run "npm start" to start the production server');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
