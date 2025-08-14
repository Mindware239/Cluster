import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { UserSession } from '../models/UserSession';
import { Role } from '../models/Role';
import { logger, logSecurityEvent } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: UserSession;
      token?: string;
      tenantId?: string;
      sectorId?: string;
    }
  }
}

// JWT payload interface
interface JWTPayload {
  userId: string;
  sessionId: string;
  tenantId: string;
  roleId: string;
  iat: number;
  exp: number;
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      logSecurityEvent('authentication_failed', {
        reason: 'missing_token',
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'medium');
      
      res.status(401).json({ 
        success: false, 
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
      return;
    }

    // Verify JWT token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as JWTPayload;
    } catch (error) {
      logSecurityEvent('authentication_failed', {
        reason: 'invalid_token',
        path: req.path,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'high');
      
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
      return;
    }

    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      logSecurityEvent('authentication_failed', {
        reason: 'expired_token',
        userId: decoded.userId,
        path: req.path,
        ip: req.ip
      }, 'medium');
      
      res.status(401).json({ 
        success: false, 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
      return;
    }

    // Get user session
    const sessionRepository = AppDataSource.getRepository(UserSession);
    const session = await sessionRepository.findOne({
      where: { 
        sessionId: decoded.sessionId,
        status: 'active'
      },
      relations: ['user', 'user.role', 'user.tenant']
    });

    if (!session || !session.isActive()) {
      logSecurityEvent('authentication_failed', {
        reason: 'invalid_session',
        userId: decoded.userId,
        sessionId: decoded.sessionId,
        path: req.path,
        ip: req.ip
      }, 'high');
      
      res.status(401).json({ 
        success: false, 
        message: 'Invalid session',
        code: 'SESSION_INVALID'
      });
      return;
    }

    // Check if user is active
    if (!session.user.isActiveUser()) {
      logSecurityEvent('authentication_failed', {
        reason: 'inactive_user',
        userId: decoded.userId,
        path: req.path,
        ip: req.ip
      }, 'medium');
      
      res.status(403).json({ 
        success: false, 
        message: 'User account is inactive',
        code: 'USER_INACTIVE'
      });
      return;
    }

    // Check IP restrictions if enabled
    if (session.user.isIPRestricted && !session.user.isIPAllowed(req.ip)) {
      logSecurityEvent('authentication_failed', {
        reason: 'ip_not_allowed',
        userId: decoded.userId,
        ip: req.ip,
        path: req.path
      }, 'high');
      
      res.status(403).json({ 
        success: false, 
        message: 'Access denied from this IP address',
        code: 'IP_RESTRICTED'
      });
      return;
    }

    // Update session activity
    session.updateActivity();
    await sessionRepository.save(session);

    // Attach user and session to request
    req.user = session.user;
    req.session = session;
    req.token = token;
    req.tenantId = decoded.tenantId;

    // Log successful authentication
    logger.debug('User authenticated successfully', {
      userId: decoded.userId,
      role: session.user.role.code,
      tenantId: decoded.tenantId,
      path: req.path,
      ip: req.ip
    });

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

// Role-based middleware
export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  if (!req.user.role.isSuperAdmin()) {
    logSecurityEvent('unauthorized_access_attempt', {
      userId: req.user.id,
      role: req.user.role.code,
      requiredRole: 'SUPER_ADMIN',
      path: req.path,
      ip: req.ip
    }, 'high');
    
    res.status(403).json({ 
      success: false, 
      message: 'Super Admin access required',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
    return;
  }

  next();
};

export const requireTenantOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  if (!req.user.role.isTenantOwner() && !req.user.role.isSuperAdmin()) {
    logSecurityEvent('unauthorized_access_attempt', {
      userId: req.user.id,
      role: req.user.role.code,
      requiredRole: 'TENANT_OWNER',
      path: req.path,
      ip: req.ip
    }, 'medium');
    
    res.status(403).json({ 
      success: false, 
      message: 'Tenant Owner access required',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
    return;
  }

  next();
};

export const requireSectorAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const sectorId = req.sectorId || req.params.sectorId;
  if (!sectorId) {
    res.status(400).json({ 
      success: false, 
      message: 'Sector ID required',
      code: 'SECTOR_ID_MISSING'
    });
    return;
  }

  if (!req.user.canAccessSector(sectorId)) {
    logSecurityEvent('unauthorized_sector_access', {
      userId: req.user.id,
      role: req.user.role.code,
      sectorId,
      path: req.path,
      ip: req.ip
    }, 'high');
    
    res.status(403).json({ 
      success: false, 
      message: 'Access to this sector denied',
      code: 'SECTOR_ACCESS_DENIED'
    });
    return;
  }

  next();
};

export const requirePermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!req.user.hasPermission(action, resource)) {
      logSecurityEvent('unauthorized_permission_access', {
        userId: req.user.id,
        role: req.user.role.code,
        resource,
        action,
        path: req.path,
        ip: req.ip
      }, 'medium');
      
      res.status(403).json({ 
        success: false, 
        message: `Permission denied: ${action} on ${resource}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

export const requireRole = (roleLevel: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (req.user.role.level > roleLevel) {
      logSecurityEvent('unauthorized_role_access', {
        userId: req.user.id,
        role: req.user.role.code,
        requiredLevel: roleLevel,
        path: req.path,
        ip: req.ip
      }, 'medium');
      
      res.status(403).json({ 
        success: false, 
        message: 'Insufficient role level',
        code: 'INSUFFICIENT_ROLE_LEVEL'
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Try to authenticate but don't fail if it doesn't work
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as JWTPayload;
        
        if (Date.now() < decoded.exp * 1000) {
          const sessionRepository = AppDataSource.getRepository(UserSession);
          const session = await sessionRepository.findOne({
            where: { 
              sessionId: decoded.sessionId,
              status: 'active'
            },
            relations: ['user', 'user.role', 'user.tenant']
          });

          if (session && session.isActive() && session.user.isActiveUser()) {
            req.user = session.user;
            req.session = session;
            req.token = token;
            req.tenantId = decoded.tenantId;
          }
        }
      } catch (error) {
        // Silently fail for optional auth
        logger.debug('Optional authentication failed:', error);
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// 2FA verification middleware
export const require2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  if (req.user.is2FAEnabled && !req.user.is2FAVerified) {
    res.status(403).json({ 
      success: false, 
      message: 'Two-factor authentication required',
      code: '2FA_REQUIRED'
    });
    return;
  }

  next();
};

// Rate limiting middleware
export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    
    const userRequests = requests.get(key);
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      userRequests.count++;
      
      if (userRequests.count > maxRequests) {
        logSecurityEvent('rate_limit_exceeded', {
          ip: req.ip,
          path: req.path,
          count: userRequests.count
        }, 'medium');
        
        res.status(429).json({ 
          success: false, 
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED'
        });
        return;
      }
    }

    next();
  };
};
