# Troubleshooting Guide

## App Crashes on Startup

### Common Causes and Solutions

#### 1. Missing AuditLog Model (FIXED ✅)
**Problem**: `Cannot find module '../models/AuditLog'`
**Solution**: The AuditLog model has been created and the auditLogger middleware has been made more robust.

#### 2. Missing Environment Variables
**Problem**: App crashes due to missing database configuration
**Solution**: 
- Copy `env.example` to `.env`
- Update with your actual database credentials
- Or use the smart startup script: `npm run start:dev:smart`

#### 3. Database Connection Issues
**Problem**: PostgreSQL not running or wrong credentials
**Solution**:
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `pos_admin_multi_tenant`

#### 4. Missing Dependencies
**Problem**: Module not found errors
**Solution**:
```bash
npm install
cd frontend && npm install
```

## Quick Fix Commands

### Start with Smart Error Handling
```bash
npm run start:dev:smart
```

### Manual Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit with your database credentials
# Update DB_PASSWORD, DB_USER, etc.
```

### Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### Frontend Only (if backend issues persist)
```bash
cd frontend
npm run dev
```

## Environment Variables Required

### Essential Variables
```bash
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pos_admin_multi_tenant
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

### Optional Variables
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
LOG_LEVEL=info
ENABLE_AUDIT_LOGS=true
```

## Database Requirements

### PostgreSQL Setup
1. Install PostgreSQL 12+
2. Create database: `CREATE DATABASE pos_admin_multi_tenant;`
3. Ensure user has proper permissions
4. Run migrations: `npm run db:migrate`

### Tables Created
- `users` - User accounts
- `tenants` - Multi-tenant organizations
- `roles` - User roles and permissions
- `audit_logs` - Activity logging

## Log Files

### Location
- `logs/exceptions.log` - Unhandled errors
- `logs/error.log` - General errors
- `logs/combined.log` - All logs
- `logs/audit.log` - Audit trail

### Check Recent Errors
```bash
tail -f logs/exceptions.log
tail -f logs/error.log
```

## Development vs Production

### Development Mode
- Uses `nodemon` for auto-restart
- Detailed error logging
- Database synchronization enabled
- CORS enabled for localhost

### Production Mode
- Static file serving
- Minimal logging
- Database migrations only
- Security headers enabled

## Still Having Issues?

### Check System Requirements
- Node.js 18+ required
- PostgreSQL 12+ required
- Windows: Ensure services are running

### Common Windows Issues
```bash
# Check PostgreSQL service
net start postgresql-x64-15

# Check if port 3000 is free
netstat -an | findstr :3000

# Check if port 3002 is free
netstat -an | findstr :3002
```

### Reset Everything
```bash
# Clear logs
rm -rf logs/*

# Clear node_modules
rm -rf node_modules
rm -rf frontend/node_modules

# Reinstall dependencies
npm install
cd frontend && npm install

# Start fresh
npm run start:dev:smart
```

## Support

If you're still experiencing issues:
1. Check the logs in `logs/` directory
2. Ensure all environment variables are set
3. Verify database connectivity
4. Check if ports are available
5. Ensure all dependencies are installed
