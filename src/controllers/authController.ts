import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/appError';
import { registerSchema } from '../utils/validations/registerSchema';
import { loginSchema } from '../utils/validations/loginSchema';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await registerSchema.validate(req.body, { abortEarly: false });

      const { email, password, name, tipo } = req.body;
      const user = await this.authService.register(email, password, name, tipo);
      res.status(201).json({ user });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = error.errors.join(', ');
        return next(
          new AppError(`Erro de validação: ${validationErrors}`, 400),
        );
      }
      next(new AppError('Erro ao registrar usuário', 500));
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await loginSchema.validate(req.body, { abortEarly: false });

      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      if (token) {
        res.status(200).json({ token });
      } else {
        next(new AppError('Credenciais inválidas', 401));
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = error.errors.join(', ');
        return next(
          new AppError(`Erro de validação: ${validationErrors}`, 400),
        );
      }
      next(new AppError('Erro ao fazer login', 500));
    }
  }
}
