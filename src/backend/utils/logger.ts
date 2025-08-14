import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'pos-admin-multi-tenant',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // File transport for audit logs
    new winston.transports.File({
      filename: path.join(logsDir, 'audit.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      tailable: true
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle unhandled rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add request logging for Express
export const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'requests.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add security logging
export const securityLogger = winston.createLogger({
  level: 'warn',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'security.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add performance logging
export const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'performance.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add tenant-specific logging
export const createTenantLogger = (tenantId: string) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { tenantId },
    transports: [
      new winston.transports.File({
        filename: path.join(logsDir, `tenant_${tenantId}.log`),
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });
};

// Add sector-specific logging
export const createSectorLogger = (tenantId: string, sectorId: string) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: { tenantId, sectorId },
    transports: [
      new winston.transports.File({
        filename: path.join(logsDir, `tenant_${tenantId}_sector_${sectorId}.log`),
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });
};

// Log rotation utility
export const rotateLogs = async (): Promise<void> => {
  try {
    const files = fs.readdirSync(logsDir);
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        logger.info(`Rotated old log file: ${file}`);
      }
    }
  } catch (error) {
    logger.error('Error rotating logs:', error);
  }
};

// Performance monitoring
export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  performanceLogger.info('Performance metric', {
    operation,
    duration,
    unit: 'ms',
    ...metadata
  });
};

// Security event logging
export const logSecurityEvent = (event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
  securityLogger.warn('Security event', {
    event,
    details,
    severity,
    timestamp: new Date().toISOString(),
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown'
  });
};

// Audit logging
export const logAudit = (action: string, resource: string, userId?: string, tenantId?: string, details?: any) => {
  const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(logsDir, 'audit.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 10
      })
    ]
  });
  
  auditLogger.info('Audit log', {
    action,
    resource,
    userId,
    tenantId,
    details,
    timestamp: new Date().toISOString()
  });
};

// Request logging middleware
export const logRequest = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      tenantId: req.headers['x-tenant-id'],
      userId: req.user?.id,
      requestId: req.headers['x-request-id']
    };
    
    requestLogger.info('HTTP Request', logData);
    
    // Log slow requests
    if (duration > 1000) {
      performanceLogger.warn('Slow request detected', logData);
    }
  });
  
  next();
};

// Error logging with context
export const logError = (error: Error, context?: any) => {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

// Database query logging
export const logDatabaseQuery = (query: string, parameters: any[], duration: number) => {
  performanceLogger.info('Database query', {
    query,
    parameters,
    duration,
    unit: 'ms'
  });
};

// Export main logger
export { logger as default };
export { logger };
