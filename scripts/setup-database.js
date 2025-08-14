const { Client } = require('pg');
const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up POS Admin Multi-Tenant Database...\n');

  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123',
    database: 'postgres' // Connect to default postgres database first
  });

  try {
    // Connect to PostgreSQL
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'POS_ADMIN']
    );

    if (dbExists.rows.length === 0) {
      // Create database
      console.log('📦 Creating database...');
      await client.query(`CREATE DATABASE "${process.env.DB_NAME || 'POS_ADMIN'}"`);
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database already exists');
    }

    await client.end();

    // Connect to the new database
    const dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'admin123',
      database: process.env.DB_NAME || 'POS_ADMIN'
    });

    await dbClient.connect();
    console.log('✅ Connected to POS_ADMIN database');

    // Enable UUID extension
    console.log('🔧 Enabling UUID extension...');
    await dbClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // Create initial schema
    console.log('🏗️  Creating initial schema...');
    await dbClient.query(`
      CREATE SCHEMA IF NOT EXISTS public;
      SET search_path TO public;
    `);
    console.log('✅ Initial schema created');

    await dbClient.end();

    // Run TypeORM migrations
    console.log('🔄 Running TypeORM migrations...');
    try {
      execSync('npm run typeorm migration:run', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Migrations completed successfully');
    } catch (error) {
      console.log('⚠️  Migration command not found, skipping...');
      console.log('   You can run migrations manually with: npm run typeorm migration:run');
    }

    // Create a super admin user and tenant for testing
    console.log('👤 Creating test super admin...');
    await createTestData();

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the backend: npm run dev:backend');
    console.log('   2. Start the frontend: npm run dev:frontend');
    console.log('   3. Access the admin panel at: http://localhost:3001');
    console.log('   4. Login with test credentials (see console output above)');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

async function createTestData() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'POS_ADMIN'
  });

  try {
    await client.connect();

    // Check if test data already exists
    const existingUser = await client.query(
      "SELECT 1 FROM users WHERE email = 'admin@posadmin.com' LIMIT 1"
    );

    if (existingUser.rows.length > 0) {
      console.log('✅ Test data already exists');
      await client.end();
      return;
    }

    // Create test tenant
    console.log('   Creating test tenant...');
    const tenantResult = await client.query(`
      INSERT INTO tenants (id, name, subdomain, company_name, admin_email, phone, subscription_plan, status)
      VALUES (uuid_generate_v4(), 'Demo Company', 'demo', 'Demo Company Ltd', 'admin@posadmin.com', '+1234567890', 'enterprise', 'active')
      RETURNING id
    `);
    const tenantId = tenantResult.rows[0].id;

    // Create super admin role
    console.log('   Creating super admin role...');
    const roleResult = await client.query(`
      INSERT INTO roles (id, name, code, level, tenant_id, is_system_role)
      VALUES (uuid_generate_v4(), 'Super Admin', 'SUPER_ADMIN', 1, $1, true)
      RETURNING id
    `);
    const roleId = roleResult.rows[0].id;

    // Create super admin user
    console.log('   Creating super admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await client.query(`
      INSERT INTO users (id, first_name, last_name, email, password, status, tenant_id, role_id, is_email_verified)
      VALUES (uuid_generate_v4(), 'Super', 'Admin', 'admin@posadmin.com', $1, 'active', $2, $3, true)
    `, [hashedPassword, tenantId, roleId]);

    // Create tenant-sector relationships
    console.log('   Setting up tenant sectors...');
    const sectors = await client.query('SELECT id FROM sectors');
    for (const sector of sectors.rows) {
      await client.query(`
        INSERT INTO tenant_sectors (id, tenant_id, sector_id, is_active)
        VALUES (uuid_generate_v4(), $1, $2, true)
      `, [tenantId, sector.id]);
    }

    console.log('✅ Test data created successfully');
    console.log('\n🔑 Test Login Credentials:');
    console.log('   Email: admin@posadmin.com');
    console.log('   Password: admin123');
    console.log('   Tenant: demo');

    await client.end();

  } catch (error) {
    console.error('❌ Failed to create test data:', error.message);
    await client.end();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };
