import { Request, Response, NextFunction } from 'express';
import { logger, logError } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  details?: any;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

// Specific error classes
export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class ExternalServiceError extends CustomError {
  constructor(message: string = 'External service error', details?: any) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
  }
}

// Error handler middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  logError(error, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    tenantId: req.tenantId,
    userId: req.user?.id,
    requestId: req.headers['x-request-id']
  });

  // Default error values
  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'An unexpected error occurred';
  const details = error.details;

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const responseDetails = isDevelopment ? details : undefined;
  const stack = isDevelopment ? error.stack : undefined;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    handleValidationError(error, res);
    return;
  }

  if (error.name === 'TypeError') {
    handleTypeError(error, res);
    return;
  }

  if (error.name === 'SyntaxError') {
    handleSyntaxError(error, res);
    return;
  }

  // Handle database errors
  if (error.code === 'DATABASE_ERROR' || error.message.includes('database')) {
    handleDatabaseError(error, res);
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    handleJWTError(error, res);
    return;
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE' || error.code === 'LIMIT_UNEXPECTED_FILE') {
    handleFileUploadError(error, res);
    return;
  }

  // Send error response
  const errorResponse = {
    error: {
      message,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      ...(responseDetails && { details: responseDetails }),
      ...(stack && { stack })
    }
  };

  // Add request ID if available
  const requestId = req.headers['x-request-id'];
  if (requestId) {
    errorResponse.error.requestId = requestId;
  }

  res.status(statusCode).json(errorResponse);
};

// Specific error handlers
function handleValidationError(error: any, res: Response): void {
  const validationErrors = error.details?.map((detail: any) => ({
    field: detail.path?.join('.') || 'unknown',
    message: detail.message,
    value: detail.value
  })) || [];

  res.status(400).json({
    error: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      details: {
        validationErrors
      }
    }
  });
}

function handleTypeError(error: TypeError, res: Response): void {
  res.status(400).json({
    error: {
      message: 'Invalid data type',
      code: 'TYPE_ERROR',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      details: {
        expectedType: error.message.includes('string') ? 'string' : 'unknown',
        receivedValue: error.message
      }
    }
  });
}

function handleSyntaxError(error: SyntaxError, res: Response): void {
  res.status(400).json({
    error: {
      message: 'Invalid syntax',
      code: 'SYNTAX_ERROR',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      details: {
        syntaxError: error.message
      }
    }
  });
}

function handleDatabaseError(error: any, res: Response): void {
  // Don't expose database details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({
    error: {
      message: 'Database operation failed',
      code: 'DATABASE_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      ...(isDevelopment && {
        details: {
          originalError: error.message,
          sqlState: error.sqlState,
          sqlMessage: error.sqlMessage
        }
      })
    }
  });
}

function handleJWTError(error: any, res: Response): void {
  let message = 'Invalid token';
  let code = 'JWT_ERROR';

  if (error.name === 'TokenExpiredError') {
    message = 'Token expired';
    code = 'JWT_EXPIRED';
  } else if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token format';
    code = 'JWT_INVALID';
  }

  res.status(401).json({
    error: {
      message,
      code,
      statusCode: 401,
      timestamp: new Date().toISOString()
    }
  });
}

function handleFileUploadError(error: any, res: Response): void {
  let message = 'File upload error';
  let details = {};

  if (error.code === 'LIMIT_FILE_SIZE') {
    message = 'File too large';
    details = { maxSize: process.env.MAX_FILE_SIZE || '10MB' };
  } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Unexpected file field';
  }

  res.status(400).json({
    error: {
      message,
      code: 'FILE_UPLOAD_ERROR',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      details
    }
  });
}

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      code: 'ENDPOINT_NOT_FOUND',
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  });
};

// Global error handler for uncaught exceptions
export const globalErrorHandler = (): void => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};

// Error response formatter
export const formatErrorResponse = (error: AppError, req: Request) => {
  const baseResponse = {
    error: {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  };

  // Add request ID if available
  const requestId = req.headers['x-request-id'];
  if (requestId) {
    baseResponse.error.requestId = requestId;
  }

  // Add details in development mode
  if (process.env.NODE_ENV === 'development' && error.details) {
    baseResponse.error.details = error.details;
  }

  return baseResponse;
};

export default errorHandler;
