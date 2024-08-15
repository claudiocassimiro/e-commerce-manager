import { UserModel } from '../models/userModel';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { $Enums, Usuario } from '@prisma/client';
import { prisma } from '../utils/prismaClient';
export class AuthService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel(prisma);
  }

  async register(
    email: string,
    password: string,
    nome: string,
    tipo: $Enums.TipoUsuario,
  ): Promise<Usuario> {
    const hashedPassword = await hashPassword(password);
    return this.userModel.createUser({
      email,
      senha: hashedPassword,
      nome,
      tipo,
    });
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userModel.findByEmail(email);
    if (user && (await comparePassword(password, user.senha))) {
      return generateToken({ id: user.id, email: user.email, tipo: user.tipo });
    }
    return null;
  }
}
