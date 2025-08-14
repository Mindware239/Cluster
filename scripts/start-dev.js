#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if .env file exists, if not create a basic one
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating basic .env file...');
  
  const basicEnv = `# Application Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pos_admin_multi_tenant
DB_USER=postgres
DB_PASSWORD=postgres
DB_SCHEMA=public

# JWT Configuration
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=dev_session_secret_change_in_production

# Multi-Tenant Configuration
DEFAULT_TENANT_SCHEMA=tenant_
TENANT_DB_POOL_SIZE=10
TENANT_DB_MAX_CONNECTIONS=50

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# Frontend Configuration (Development)
FRONTEND_DEV_PORT=3002
FRONTEND_DEV_URL=http://localhost:3002

# Feature Flags
ENABLE_2FA=false
ENABLE_IP_WHITELISTING=false
ENABLE_AUDIT_LOGS=true
ENABLE_REAL_TIME_UPDATES=false
`;
  
  fs.writeFileSync(envPath, basicEnv);
  console.log('✅ Basic .env file created. Please update with your actual database credentials.');
}

// Check if PostgreSQL is running
async function checkPostgreSQL() {
  return new Promise((resolve) => {
    const pgCheck = spawn('pg_isready', ['-h', 'localhost', '-p', '5432']);
    
    pgCheck.on('close', (code) => {
      if (code === 0) {
        console.log('✅ PostgreSQL is running');
        resolve(true);
      } else {
        console.log('❌ PostgreSQL is not running. Please start PostgreSQL first.');
        console.log('   On Windows, you can use: net start postgresql-x64-15');
        console.log('   Or start it from Services (services.msc)');
        resolve(false);
      }
    });
    
    pgCheck.on('error', () => {
      console.log('❌ PostgreSQL check failed. Please ensure PostgreSQL is installed and running.');
      resolve(false);
    });
  });
}

// Start the application
async function startApp() {
  const pgRunning = await checkPostgreSQL();
  
  if (!pgRunning) {
    console.log('\n🚀 Starting app anyway (database operations may fail)...');
  }
  
  console.log('\n🚀 Starting POS Admin application...');
  console.log('📱 Frontend will be available at: http://localhost:3002');
  console.log('🔧 Backend API will be available at: http://localhost:3000');
  console.log('📊 Health check: http://localhost:3000/health');
  
  // Start the backend
  const backend = spawn('npm', ['run', 'dev:backend'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..')
  });
  
  // Wait a bit then start the frontend
  setTimeout(() => {
    const frontend = spawn('npm', ['run', 'dev:frontend'], {
      stdio: 'inherit',
      shell: true,
      cwd: path.join(__dirname, '..')
    });
    
    frontend.on('close', (code) => {
      console.log(`Frontend process exited with code ${code}`);
      backend.kill();
    });
  }, 2000);
  
  backend.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    backend.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down...');
    backend.kill();
    process.exit(0);
  });
}

startApp().catch(console.error);
