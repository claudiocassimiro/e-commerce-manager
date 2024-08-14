import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

type UserType = 'ADMIN' | 'CLIENTE';

export const autorizeMiddleware = (allowedRoles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.usuario;

    if (!user) {
      return next(new AppError('Usuário não autenticado', 401));
    }

    if (!allowedRoles.includes(user.tipo)) {
      return next(
        new AppError('Você não tem permissão para acessar esta rota', 403),
      );
    }

    next();
  };
};
