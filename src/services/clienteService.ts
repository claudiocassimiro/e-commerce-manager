// src/services/clienteService.ts

import { PrismaClient } from '@prisma/client';
import { Cliente } from '@prisma/client';

const prisma = new PrismaClient();

interface ClienteData {
  nomeCompleto: string;
  contato: string;
  endereco: string;
  status: boolean;
  usuarioId: string;
}

interface ClienteFilter {
  nomeCompleto?: string;
  status?: boolean;
}

export class ClienteService {
  async createCliente(data: ClienteData) {
    const cliente = await prisma.cliente.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        contato: data.contato,
        endereco: data.endereco,
        status: data.status,
        usuario: {
          connect: {
            id: data.usuarioId,
          },
        },
      },
    });
    return cliente;
  }

  async getClienteById(id: string): Promise<Cliente | null> {
    return await prisma.cliente.findUnique({
      where: { id },
    });
  }

  async updateCliente(
    id: string,
    data: Partial<ClienteData>,
  ): Promise<Cliente | null> {
    return await prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async deleteCliente(id: string): Promise<Cliente | null> {
    return await prisma.cliente.delete({
      where: { id },
    });
  }

  async getClientes(filters: ClienteFilter): Promise<Cliente[]> {
    return await prisma.cliente.findMany({
      where: {
        ...(filters.nomeCompleto && {
          nomeCompleto: { contains: filters.nomeCompleto, mode: 'insensitive' },
        }),
        ...(filters.status !== undefined && { status: filters.status }),
      },
    });
  }
}
