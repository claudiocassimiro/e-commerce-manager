import { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { AppError } from '../utils/appError';
import { Usuario } from '@prisma/client';

jest.mock('../services/authService');

describe('AuthController - Register', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let authController: AuthController;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    authController = new AuthController();
    authServiceMock = AuthService.prototype as jest.Mocked<AuthService>;
  });

  it('deve registrar um novo usuário com sucesso', async () => {
    req.body = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      tipo: 'ADMIN',
    };

    const userMock = {
      id: '123',
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: 'securepassword123',
      tipo: 'ADMIN',
    } as Usuario;

    authServiceMock.register.mockResolvedValue(userMock);

    await authController.register(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: userMock });
  });

  it('deve retornar erro de validação se os dados forem inválidos', async () => {
    req.body = {
      email: 'invalid-email',
      password: '123',
      name: '',
      tipo: 'InvalidType',
    };

    await authController.register(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.message).toContain('Erro de validação');
    expect(error.statusCode).toBe(400);
  });

  it('deve retornar erro 500 se o serviço de registro falhar', async () => {
    req.body = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      tipo: 'Cliente',
    };

    authServiceMock.register.mockRejectedValue(new Error('Erro de serviço'));

    await authController.register(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.message).toBe('Erro de validação: Tipo de usuário inválido');
    expect(error.statusCode).toBe(400);
  });

  it('deve retornar erro 409 se o email já estiver em uso', async () => {
    req.body = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      tipo: 'Cliente',
    };

    authServiceMock.register.mockRejectedValue(
      new AppError('Erro de validação: Tipo de usuário inválido', 409),
    );

    await authController.register(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error.message).toBe('Erro de validação: Tipo de usuário inválido');
    expect(error.statusCode).toBe(400);
  });
});
