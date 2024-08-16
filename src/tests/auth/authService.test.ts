/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from '../../services/authService';
import { UserModel } from '../../models/userModel';
import { generateToken } from '../../utils/jwt';
import { hashPassword, comparePassword } from '../../utils/bcrypt';
import { prisma } from '../../utils/prismaClient';

jest.mock('../../models/userModel');
jest.mock('../../utils/jwt');
jest.mock('../../utils/bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: jest.Mocked<UserModel>;

  beforeEach(() => {
    userModel = new UserModel(prisma) as jest.Mocked<UserModel>;
    authService = new AuthService();
    (authService as any).userModel = userModel;
  });

  describe('register', () => {
    it('deve registrar um novo usuário com senha com hash', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        senha: 'hashedPassword',
        nome: 'Test User',
        tipo: 'ADMIN',
      };
      const mockHashPassword = 'hashedPassword';

      (hashPassword as jest.Mock).mockResolvedValue(mockHashPassword);
      userModel.createUser.mockResolvedValue(mockUser as any);

      const result = await authService.register(
        'test@example.com',
        'password',
        'Test User',
        'ADMIN',
      );

      expect(hashPassword).toHaveBeenCalledWith('password');
      expect(userModel.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        senha: 'hashedPassword',
        nome: 'Test User',
        tipo: 'ADMIN',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('deve retornar um token se o login for bem-sucedido', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        senha: 'hashedPassword',
        tipo: 'ADMIN',
      };
      const mockToken = 'mockToken';

      userModel.findByEmail.mockResolvedValue(mockUser as any);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.login('test@example.com', 'password');

      expect(userModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(comparePassword).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
      expect(generateToken).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        tipo: mockUser.tipo,
      });
      expect(result).toBe(mockToken);
    });

    it('deve retornar nulo se o login falhar', async () => {
      userModel.findByEmail.mockResolvedValue(null);

      const result = await authService.login('test@example.com', 'password');

      expect(userModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(comparePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
