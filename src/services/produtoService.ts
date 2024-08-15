// src/services/produtoService.ts

import { Produto } from '@prisma/client';
import { prisma } from '../utils/prismaClient';
import { Decimal } from '@prisma/client/runtime/library';

interface ProdutoData {
  nome: string;
  preco: Decimal;
  quantidadeEmEstoque: number;
  descricao: string;
}

export class ProdutoService {
  async createProduto(data: ProdutoData): Promise<Produto> {
    return prisma.produto.create({
      data: {
        nome: data.nome,
        preco: data.preco,
        quantidadeEmEstoque: data.quantidadeEmEstoque,
        descricao: data.descricao,
      },
    });
  }

  async getProdutoById(id: string): Promise<Produto | null> {
    return prisma.produto.findUnique({ where: { id } });
  }

  async updateProduto(
    id: string,
    data: Partial<Produto>,
  ): Promise<Produto | null> {
    return prisma.produto.update({ where: { id }, data });
  }

  async deleteProduto(id: string): Promise<Produto | null> {
    return prisma.produto.delete({ where: { id } });
  }

  async getProdutos(
    precoMin?: number,
    precoMax?: number,
    disponibilidade?: boolean,
  ): Promise<Produto[]> {
    return prisma.produto.findMany({
      where: {
        AND: [
          precoMin ? { preco: { gte: precoMin } } : {},
          precoMax ? { preco: { lte: precoMax } } : {},
          disponibilidade !== undefined
            ? { quantidadeEmEstoque: { gt: 0 } }
            : {},
        ],
      },
    });
  }
}
