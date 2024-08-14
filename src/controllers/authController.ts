/* eslint-disable @typescript-eslint/no-unused-vars */
// src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/appError';

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
    const { email, password, name, tipo } = req.body;
    try {
      const user = await this.authService.register(email, password, name, tipo);
      res.status(201).json({ user });
    } catch (error) {
      next(new AppError('Erro ao registrar usuário', 500));
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    try {
      const token = await this.authService.login(email, password);
      if (token) {
        res.status(200).json({ token });
      } else {
        next(new AppError('Credenciais inválidas', 401));
      }
    } catch (error) {
      next(new AppError('Erro ao fazer login', 500));
    }
  }
}
