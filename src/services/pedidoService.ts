import { prisma } from '../utils/prismaClient'; // Altere para o caminho correto do seu prisma
import { Pedido, ItemDoPedido, $Enums } from '@prisma/client';

export class PedidoService {
  async createPedido(
    idCliente: string,
    total: number,
    itens: ItemDoPedido[],
  ): Promise<Pedido> {
    const pedido = await prisma.pedido.create({
      data: {
        idCliente,
        status: $Enums.StatusPedido.RECEBIDO,
        total,
        itens: {
          create: itens.map(item => ({
            idProduto: item.idProduto,
            quantidade: item.quantidade,
            precoPorUnidade: item.precoPorUnidade,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        itens: true,
      },
    });
    return pedido;
  }

  async getAllPedidos(): Promise<Pedido[]> {
    return prisma.pedido.findMany({
      include: {
        itens: true,
      },
    });
  }

  async getPedidoById(id: string): Promise<Pedido | null> {
    return prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: true,
      },
    });
  }

  async updatePedido(
    id: string,
    data: {
      status: $Enums.StatusPedido | undefined;
      itens: ItemDoPedido[];
      total: number;
    },
  ): Promise<Pedido | null> {
    return prisma.$transaction(async prisma => {
      if (data.status) {
        await prisma.pedido.update({
          where: { id },
          data: {
            status: data.status,
          },
        });
      }

      if (data.total) {
        await prisma.pedido.update({
          where: { id },
          data: {
            total: data.total,
          },
        });
      }

      if (data.itens) {
        await prisma.itemDoPedido.deleteMany({
          where: {
            idPedido: id,
          },
        });

        await prisma.itemDoPedido.createMany({
          data: data.itens.map(item => ({
            idPedido: id,
            idProduto: item.idProduto,
            quantidade: item.quantidade,
            precoPorUnidade: item.precoPorUnidade,
            subtotal: item.subtotal,
          })),
        });
      }

      return prisma.pedido.findUnique({
        where: { id },
        include: {
          itens: true,
        },
      });
    });
  }

  async deletePedido(id: string): Promise<Pedido | null> {
    return prisma.pedido.delete({
      where: { id },
    });
  }
}
