import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Tenant } from '../models/Tenant';
import { logger, logSecurityEvent } from '../utils/logger';

// Extend Express Request interface to include tenant information
declare global {
  namespace Express {
    interface Request {
      tenant?: Tenant;
      tenantId?: string;
      sectorId?: string;
      isMultiTenant?: boolean;
    }
  }
}

export const tenantResolver = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const startTime = Date.now();
    
    // Skip tenant resolution for certain endpoints
    if (shouldSkipTenantResolution(req.path)) {
      return next();
    }

    // Extract tenant identifier from various sources
    const tenantIdentifier = extractTenantIdentifier(req);
    
    if (!tenantIdentifier) {
      // For public endpoints, continue without tenant
      if (isPublicEndpoint(req.path)) {
        return next();
      }
      
      // For protected endpoints, return error
      res.status(400).json({
        error: 'Tenant identifier required',
        message: 'Please provide a valid tenant identifier',
        code: 'TENANT_IDENTIFIER_MISSING'
      });
      return;
    }

    // Resolve tenant from database
    const tenant = await resolveTenant(tenantIdentifier);
    
    if (!tenant) {
      logSecurityEvent('tenant_resolution_failed', {
        identifier: tenantIdentifier,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'high');
      
      res.status(404).json({
        error: 'Tenant not found',
        message: 'The specified tenant could not be found',
        code: 'TENANT_NOT_FOUND'
      });
      return;
    }

    // Validate tenant status
    if (!isTenantActive(tenant)) {
      logSecurityEvent('inactive_tenant_access_attempt', {
        tenantId: tenant.id,
        tenantStatus: tenant.status,
        path: req.path,
        ip: req.ip
      }, 'medium');
      
      res.status(403).json({
        error: 'Tenant access denied',
        message: 'This tenant is not currently active',
        code: 'TENANT_INACTIVE'
      });
      return;
    }

    // Check subscription status
    if (!tenant.isSubscriptionActive()) {
      logSecurityEvent('expired_subscription_access_attempt', {
        tenantId: tenant.id,
        subscriptionEndDate: tenant.subscriptionEndDate,
        path: req.path,
        ip: req.ip
      }, 'medium');
      
      res.status(403).json({
        error: 'Subscription expired',
        message: 'Your subscription has expired. Please renew to continue.',
        code: 'SUBSCRIPTION_EXPIRED'
      });
      return;
    }

    // Extract sector information if present
    const sectorId = extractSectorId(req);
    
    // Validate sector access if sector is specified
    if (sectorId && !tenant.hasSectorAccess(sectorId)) {
      logSecurityEvent('unauthorized_sector_access_attempt', {
        tenantId: tenant.id,
        sectorId,
        path: req.path,
        ip: req.ip
      }, 'high');
      
      res.status(403).json({
        error: 'Sector access denied',
        message: 'You do not have access to this sector',
        code: 'SECTOR_ACCESS_DENIED'
      });
      return;
    }

    // Attach tenant information to request
    req.tenant = tenant;
    req.tenantId = tenant.id;
    req.sectorId = sectorId || '';
    req.isMultiTenant = true;

    // Log successful tenant resolution
    const resolutionTime = Date.now() - startTime;
    logger.debug('Tenant resolved successfully', {
      tenantId: tenant.id,
      tenantName: tenant.name,
      sectorId,
      path: req.path,
      resolutionTime
    });

    next();
  } catch (error) {
    logger.error('Error in tenant resolver:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to resolve tenant',
      code: 'TENANT_RESOLUTION_ERROR'
    });
    return;
  }
};

// Helper functions
function shouldSkipTenantResolution(path: string): boolean {
  const skipPaths = [
    '/health',
    '/metrics',
    '/docs',
    '/api-docs',
    '/swagger',
    '/favicon.ico'
  ];
  
  return skipPaths.some(skipPath => path.startsWith(skipPath));
}

function isPublicEndpoint(path: string): boolean {
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email'
  ];
  
  return publicPaths.some(publicPath => path.startsWith(publicPath));
}

function extractTenantIdentifier(req: Request): string | null {
  // Priority order for tenant identification:
  // 1. X-Tenant-ID header
  // 2. Subdomain from host
  // 3. Custom domain from host
  // 4. Query parameter
  // 5. JWT token (if available)
  
  // Check X-Tenant-ID header
  const headerTenantId = req.headers['x-tenant-id'] as string;
  if (headerTenantId) {
    return headerTenantId;
  }

  // Check subdomain
  const host = req.get('host') || '';
  const subdomain = extractSubdomain(host);
  if (subdomain) {
    return subdomain;
  }

  // Check custom domain
  const customDomain = extractCustomDomain(host);
  if (customDomain) {
    return customDomain;
  }

  // Check query parameter
  const queryTenantId = req.query.tenant as string;
  if (queryTenantId) {
    return queryTenantId;
  }

  // Check JWT token for tenant information (if available)
  const tokenTenantId = extractTenantFromToken(req);
  if (tokenTenantId) {
    return tokenTenantId;
  }

  return null;
}

function extractSubdomain(host: string): string | null {
  // Extract subdomain from host (e.g., "tenant1.localhost:3000" -> "tenant1")
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
}

function extractCustomDomain(_host: string): string | null {
  // Extract custom domain and map to tenant
  // This would typically involve a lookup table or database query
  // For now, return null
  return null;
}

function extractTenantFromToken(_req: Request): string | null {
  // Extract tenant information from JWT token if available
  // This would be implemented when JWT middleware is added
  return null;
}

function extractSectorId(req: Request): string | null {
  // Extract sector ID from various sources
  const headerSectorId = req.headers['x-sector-id'] as string;
  if (headerSectorId) {
    return headerSectorId;
  }

  const querySectorId = req.query.sector as string;
  if (querySectorId) {
    return querySectorId;
  }

  // Extract from path (e.g., /api/v1/pos/... -> pos)
  const pathParts = req.path.split('/');
  const sectorIndex = pathParts.findIndex(part => 
    ['pos', 'warehouse'].includes(part)
  );
  
  if (sectorIndex !== -1) {
    return pathParts[sectorIndex];
  }

  return null;
}

async function resolveTenant(identifier: string): Promise<Tenant | null> {
  try {
    const tenantRepository = AppDataSource.getRepository(Tenant);
    
    // Try to find tenant by various identifiers
    let tenant = await tenantRepository.findOne({
      where: [
        { id: identifier },
        { subdomain: identifier },
        { domain: identifier }
      ],
      relations: ['tenantSectors', 'tenantSectors.sector']
    });

    if (!tenant) {
      // Try case-insensitive search for subdomain
      tenant = await tenantRepository
        .createQueryBuilder('tenant')
        .leftJoinAndSelect('tenant.tenantSectors', 'tenantSectors')
        .leftJoinAndSelect('tenantSectors.sector', 'sector')
        .where('LOWER(tenant.subdomain) = LOWER(:identifier)', { identifier })
        .getOne();
    }

    return tenant;
  } catch (error) {
    logger.error('Error resolving tenant:', error);
    return null;
  }
}

function isTenantActive(tenant: Tenant): boolean {
  return tenant.isActive && 
         tenant.status === 'active' && 
         tenant.tenantSectors.some(ts => ts.isActive);
}

// Export middleware for use in routes
export default tenantResolver;
