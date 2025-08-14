import { Router, Request, Response } from 'express';
import { DatabaseManager } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

// Basic health check
router.get('/', async (_req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Check database connectivity
    const dbHealthy = await DatabaseManager.healthCheck();
    
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      responseTime: `${responseTime}ms`,
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        redis: 'unknown', // TODO: Add Redis health check
        external: 'unknown' // TODO: Add external service health checks
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      cpu: {
        usage: process.cpuUsage(),
        uptime: process.uptime()
      }
    };

    const overallStatus = dbHealthy ? 200 : 503;
    
    res.status(overallStatus).json(healthStatus);
    
    // Log health check
    logger.info('Health check completed', {
      status: overallStatus === 200 ? 'healthy' : 'unhealthy',
      responseTime,
      dbHealthy
    });
    
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Detailed health check
router.get('/detailed', async (_req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Perform comprehensive health checks
    const healthChecks = await performDetailedHealthChecks();
    
    const responseTime = Date.now() - startTime;
    
    const overallStatus = healthChecks.every(check => check.status === 'healthy') ? 200 : 503;
    
    const detailedStatus = {
      status: overallStatus === 200 ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      checks: healthChecks,
      summary: {
        total: healthChecks.length,
        healthy: healthChecks.filter(check => check.status === 'healthy').length,
        unhealthy: healthChecks.filter(check => check.status === 'unhealthy').length,
        warnings: healthChecks.filter(check => check.status === 'warning').length
      }
    };
    
    res.status(overallStatus).json(detailedStatus);
    
    // Log detailed health check
    logger.info('Detailed health check completed', {
      status: overallStatus === 200 ? 'healthy' : 'unhealthy',
      responseTime,
      summary: detailedStatus.summary
    });
    
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Database health check
router.get('/database', async (_req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    const dbHealthy = await DatabaseManager.healthCheck();
    const responseTime = Date.now() - startTime;
    
    const dbStatus = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        name: process.env.DB_NAME || 'pos_admin_multi_tenant',
        connected: dbHealthy
      }
    };
    
    res.status(dbHealthy ? 200 : 503).json(dbStatus);
    
  } catch (error) {
    logger.error('Database health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// System metrics
router.get('/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        uptime: process.uptime(),
        pid: process.pid,
        title: process.title
      },
      memory: {
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        rss: process.memoryUsage().rss,
        arrayBuffers: process.memoryUsage().arrayBuffers
      },
      cpu: {
        usage: process.cpuUsage(),
        uptime: process.uptime()
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || '3000',
        apiVersion: process.env.API_VERSION || 'v1'
      }
    };
    
    res.json(metrics);
    
  } catch (error) {
    logger.error('Metrics collection failed:', error);
    
    res.status(500).json({
      error: 'Metrics collection failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Readiness probe (for Kubernetes)
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check if the application is ready to serve requests
    const dbHealthy = await DatabaseManager.healthCheck();
    
    if (!dbHealthy) {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        reason: 'Database not connected'
      });
      return;
    }
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Readiness check failed:', error);
    
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      reason: 'Health check failed'
    });
  }
});

// Liveness probe (for Kubernetes)
router.get('/live', async (_req: Request, res: Response) => {
  try {
    // Simple check to see if the process is alive
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
    
  } catch (error) {
    logger.error('Liveness check failed:', error);
    
    res.status(503).json({
      status: 'not alive',
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function to perform detailed health checks
async function performDetailedHealthChecks(): Promise<any[]> {
  const checks = [];
  
  // Database health check
  try {
    const startTime = Date.now();
    const dbHealthy = await DatabaseManager.healthCheck();
    const responseTime = Date.now() - startTime;
    
    checks.push({
      name: 'Database',
      status: dbHealthy ? 'healthy' : 'unhealthy',
      responseTime: `${responseTime}ms`,
      details: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        connected: dbHealthy
      }
    });
  } catch (error) {
    checks.push({
      name: 'Database',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  // Memory health check
  try {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const memoryUsagePercent = Math.round((heapUsedMB / heapTotalMB) * 100);
    
    let memoryStatus = 'healthy';
    if (memoryUsagePercent > 90) {
      memoryStatus = 'unhealthy';
    } else if (memoryUsagePercent > 80) {
      memoryStatus = 'warning';
    }
    
    checks.push({
      name: 'Memory',
      status: memoryStatus,
      details: {
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        usagePercent: `${memoryUsagePercent}%`
      }
    });
  } catch (error) {
    checks.push({
      name: 'Memory',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  // Uptime health check
  try {
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    
    let uptimeStatus = 'healthy';
    if (uptime < 60) { // Less than 1 minute
      uptimeStatus = 'warning';
    }
    
    checks.push({
      name: 'Uptime',
      status: uptimeStatus,
      details: {
        seconds: Math.round(uptime),
        hours: uptimeHours,
        minutes: Math.floor((uptime % 3600) / 60)
      }
    });
  } catch (error) {
    checks.push({
      name: 'Uptime',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  // Environment health check
  try {
    const requiredEnvVars = [
      'DB_HOST',
      'DB_USER',
      'DB_PASSWORD',
      'JWT_SECRET'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    checks.push({
      name: 'Environment',
      status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      details: {
        nodeEnv: process.env.NODE_ENV || 'development',
        missingVariables: missingEnvVars
      }
    });
  } catch (error) {
    checks.push({
      name: 'Environment',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  
  return checks;
}

export { router as healthRoutes };
