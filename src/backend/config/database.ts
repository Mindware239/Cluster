import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config();

// Database configuration
const baseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'multi_tenant_saas',
  schema: process.env.DB_SCHEMA || 'public',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
  migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// Main application data source
export const AppDataSource = new DataSource(baseConfig);

// Database connection manager
export class DatabaseManager {
  static async initialize(): Promise<void> {
    try {
      // Check if database environment variables are set
      if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
        console.warn('⚠️ Database environment variables not set, skipping database connection');
        console.warn('⚠️ Set DB_HOST, DB_USER, and DB_PASSWORD to connect to database');
        return;
      }

      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('Main database connection established');
      }
    } catch (error) {
      console.error('Failed to initialize main database connection:', error);
      console.warn('⚠️ Server will continue without database connection');
      console.warn('⚠️ Some features may not work properly');
    }
  }

  static async close(): Promise<void> {
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('Main database connection closed');
      }
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      if (!AppDataSource.isInitialized) {
        return false;
      }
      
      await AppDataSource.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Export default data source for backward compatibility
export default AppDataSource;
