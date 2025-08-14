import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger, logPerformance } from '../utils/logger';

// Extend Express Request interface to include request ID
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  const requestId = uuidv4();
  req.requestId = requestId;
  req.startTime = Date.now();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);

  // Log request start
  logger.info('HTTP Request Started', {
    requestId,
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    tenantId: req.headers['x-tenant-id'],
    sectorId: req.headers['x-sector-id'],
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    timestamp: new Date().toISOString()
  });

  // Log request body for non-GET requests (excluding sensitive data)
  if (req.method !== 'GET' && req.body) {
    const sanitizedBody = sanitizeRequestBody(req.body);
    logger.debug('Request Body', {
      requestId,
      body: sanitizedBody
    });
  }

  // Override res.end to capture response details
  const originalEnd = res.end;
  (res as any).end = function(chunk?: any, encoding?: any) {
    const endTime = Date.now();
    const duration = endTime - (req.startTime || endTime);
    
    // Log response details
    logger.info('HTTP Request Completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      duration,
      contentLength: res.get('Content-Length'),
      contentType: res.get('Content-Type'),
      timestamp: new Date().toISOString()
    });

    // Log performance metrics for slow requests
    if (duration > 1000) {
      logPerformance('slow_request', duration, {
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode
      });
    }

    // Log performance metrics for all requests
    logPerformance('http_request', duration, {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode
    });

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  // Log response headers for debugging
  res.on('finish', () => {
    logger.debug('Response Headers', {
      requestId,
      headers: res.getHeaders()
    });
  });

  // Log errors
  res.on('error', (error) => {
    logger.error('Response Error', {
      requestId,
      error: error.message,
      stack: error.stack
    });
  });

  next();
};

// Sanitize request body to remove sensitive information
function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'credential',
    'ssn',
    'creditCard',
    'cardNumber',
    'cvv',
    'pin'
  ];

  const sanitized = { ...body };
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveFields.some(field => 
      key.toLowerCase().includes(field.toLowerCase())
    )) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeRequestBody(sanitized[key]);
    }
  });

  return sanitized;
}

// Export middleware for use in routes
export default requestLogger;
