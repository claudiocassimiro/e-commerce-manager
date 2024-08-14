import { PrismaClient, Usuario } from '@prisma/client';

export class UserModel {
  private ormProvider: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.ormProvider = prismaClient;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.ormProvider.usuario.findUnique({
      where: { email },
    });
  }

  async createUser(
    data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Usuario> {
    return this.ormProvider.usuario.create({
      data,
    });
  }
}
