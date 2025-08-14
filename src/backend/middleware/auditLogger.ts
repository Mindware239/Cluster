import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuditLog } from '../models/AuditLog';
import { logger } from '../utils/logger';

export interface AuditLogData {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  status: 'success' | 'failure' | 'pending';
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  error?: string;
}

// Audit logging middleware
export const auditLogger = (action: string, resource: string, getResourceId?: (req: Request) => string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const startTime = Date.now();
    const originalSend = res.send;
    const originalJson = res.json;
    const originalStatus = res.status;

    let statusCode = 200;
    let responseBody: any = {};
    let auditData: AuditLogData = {
      action,
      resource,
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Override res.status to capture status code
    res.status = function(code: number) {
      statusCode = code;
      return originalStatus.call(this, code);
    };

    // Override res.json to capture response body
    res.json = function(body: any) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    // Override res.send to capture response body
    res.send = function(body: any) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    try {
      // Wait for the next middleware/route handler
      await new Promise<void>((resolve, reject) => {
        next();
        resolve();
      });

      // Determine if the action was successful
      const isSuccess = statusCode >= 200 && statusCode < 300;
      auditData.status = isSuccess ? 'success' : 'failure';
      auditData.duration = Date.now() - startTime;

      // Get resource ID if function provided
      if (getResourceId) {
        try {
          auditData.resourceId = getResourceId(req);
        } catch (error) {
          logger.warn('Failed to get resource ID for audit log:', error);
        }
      }

      // Add additional details from request
      if (req.user) {
        auditData.details = {
          ...auditData.details,
          userId: req.user.id,
          userEmail: req.user.email,
          role: req.user.role?.code || 'unknown',
          tenantId: req.user.tenantId || req.user.tenant?.id
        };
      }

      if (req.tenantId) {
        auditData.details = {
          ...auditData.details,
          tenantId: req.user?.tenantId || req.user?.tenant?.id || req.tenantId
        };
      }

      if (req.sectorId) {
        auditData.details = {
          ...auditData.details,
          sectorId: req.sectorId
        };
      }

      // Add request details
      auditData.details = {
        ...auditData.details,
        method: req.method,
        path: req.path,
        query: req.query,
        body: sanitizeRequestBody(req.body),
        statusCode,
        responseSize: JSON.stringify(responseBody).length
      };

      // Log the audit entry
      await logAuditEntry(auditData);

    } catch (error) {
      // Handle errors
      auditData.status = 'failure';
      auditData.duration = Date.now() - startTime;
      auditData.error = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Audit logging error:', error);
      
      // Still try to log the audit entry
      try {
        await logAuditEntry(auditData);
      } catch (auditError) {
        logger.error('Failed to log audit entry:', auditError);
      }
    }
  };
};

// Function to sanitize request body for audit logging
function sanitizeRequestBody(body: any): any {
  if (!body) return body;

  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

// Function to create and persist audit log entry
async function logAuditEntry(auditData: AuditLogData): Promise<void> {
  try {
    // Check if database is initialized
    if (!AppDataSource.isInitialized) {
      logger.warn('Database not initialized, skipping audit log entry');
      return;
    }

    const auditLogRepository = AppDataSource.getRepository(AuditLog);
    
    const auditLog = new AuditLog();
    auditLog.action = auditData.action;
    auditLog.resource = auditData.resource;
    auditLog.resourceId = auditData.resourceId;
    auditLog.details = auditData.details;
    auditLog.status = auditData.status;
    auditLog.ipAddress = auditData.ipAddress;
    auditLog.userAgent = auditData.userAgent;
    auditLog.duration = auditData.duration;
    auditLog.error = auditData.error;
    
    // Set user and tenant if available
    if (auditData.details?.userId) {
      auditLog.userId = auditData.details.userId;
    }
    
    if (auditData.details?.tenantId) {
      auditLog.tenantId = auditData.details.tenantId;
    }

    await auditLogRepository.save(auditLog);

    logger.debug('Audit log entry created', {
      action: auditData.action,
      resource: auditData.resource,
      status: auditData.status,
      duration: auditData.duration
    });

  } catch (error) {
    logger.error('Failed to create audit log entry:', error);
    // Don't throw error to prevent app crashes
    // Just log it and continue
  }
}

// Convenience functions for common audit actions
export const auditCreate = (resource: string, getResourceId?: (req: Request) => string) => 
  auditLogger('create', resource, getResourceId);

export const auditRead = (resource: string, getResourceId?: (req: Request) => string) => 
  auditLogger('read', resource, getResourceId);

export const auditUpdate = (resource: string, getResourceId?: (req: Request) => string) => 
  auditLogger('update', resource, getResourceId);

export const auditDelete = (resource: string, getResourceId?: (req: Request) => string) => 
  auditLogger('delete', resource, getResourceId);

export const auditLogin = () => auditLogger('login', 'user');
export const auditLogout = () => auditLogger('logout', 'user');
export const auditAccess = (resource: string) => auditLogger('access', resource);

// Middleware to log all requests (for debugging)
export const logAllRequests = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    try {
      const duration = Date.now() - startTime;
      const logData = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        tenantId: req.tenantId || req.user?.tenantId || req.user?.tenant?.id
      };

      if (res.statusCode >= 400) {
        logger.warn('Request completed with error', logData);
      } else {
        logger.debug('Request completed', logData);
      }
    } catch (error) {
      // Don't let logging errors crash the app
      logger.error('Error in request logging middleware:', error);
    }
  });

  next();
};
