import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Usuario } from '@prisma/client';
import { AppError } from '../utils/appError';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const decoded: Usuario | null = verifyToken(token);
    if (decoded) {
      req.usuario = decoded;
      next();
    } else {
      return next(new AppError('Usuário não encontrado', 404));
    }
  } else {
    next(new AppError('Token inválido', 401));
  }
};
