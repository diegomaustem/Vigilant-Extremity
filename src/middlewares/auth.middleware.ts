import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../modules/auth/auth.service.js';
import { UnauthorizedError } from '../utils/errors.js';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
      userName?: string;
      userRole?: number | string;
    }
  }
}

export function authMiddleware(authService: AuthService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new UnauthorizedError('Token não fornecido ou mal formatado.');
    }

    const payload = authService.verifyToken(token);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    req.userName = payload.name;
    req.userRole = payload.roleId;
    next();
  };
}