import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/appError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: Registra um novo usuário
   *     tags: [Auth]
   *     description: Cria um novo usuário com email, senha, nome e tipo.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *               name:
   *                 type: string
   *                 example: John Doe
   *               tipo:
   *                 type: string
   *                 example: ADMIN
   *     responses:
   *       201:
   *         description: Usuário registrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     email:
   *                       type: string
   *                     name:
   *                       type: string
   *                     tipo:
   *                       type: string
   *       400:
   *         description: Erro de validação
   *       409:
   *         description: Usuário já existe
   *       500:
   *         description: Erro interno do servidor
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
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

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return next(new AppError('Usuário já existe', 409));
      }

      next(new AppError('Erro ao registrar usuário', 500));
    }
  }

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Faz login de um usuário
   *     tags: [Auth]
   *     description: Faz login de um usuário com email e senha e retorna um token.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: Login bem-sucedido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       401:
   *         description: Credenciais inválidas
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro interno do servidor
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
