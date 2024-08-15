/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

export class RelatorioService {
  async gerarRelatorio(periodo: string): Promise<string> {
    const [inicio, fim] = this.parsePeriodo(periodo);
    const formatedFim = new Date(fim);
    formatedFim.setHours(formatedFim.getHours() + 23);
    formatedFim.setMinutes(formatedFim.getMinutes() + 59);

    const vendas = await prisma.pedido.findMany({
      where: {
        dataPedido: {
          gte: new Date(inicio),
          lte: formatedFim,
        },
      },
      include: {
        itens: true,
      },
    });

    console.log(vendas);

    if (vendas.length === 0) {
      throw new AppError(
        'Nenhuma venda encontrada no período especificado',
        404,
      );
    }

    const totalVendas = vendas.reduce((total, pedido) => {
      return total + Number(pedido.total);
    }, 0);

    const produtosVendidos = vendas.reduce((count, pedido) => {
      return (
        count + pedido.itens.reduce((sum, item) => sum + item.quantidade, 0)
      );
    }, 0);

    const relatorioPath = await this.gerarCSV(
      vendas,
      totalVendas,
      produtosVendidos,
      periodo,
    );

    return relatorioPath;
  }

  private async gerarCSV(
    vendas: any[],
    totalVendas: number,
    produtosVendidos: number,
    periodo: string,
  ): Promise<string> {
    const csvWriter = createObjectCsvWriter({
      path: path.join(
        __dirname,
        '..',
        '..',
        'relatorios',
        `relatorio-${periodo}.csv`,
      ),
      header: [
        { id: 'id', title: 'ID Pedido' },
        { id: 'dataPedido', title: 'Data do Pedido' },
        { id: 'status', title: 'Status' },
        { id: 'total', title: 'Total' },
        { id: 'quantidadeItens', title: 'Quantidade de Itens' },
      ],
    });

    const registros = vendas.map(pedido => ({
      id: pedido.id,
      dataPedido: pedido.dataPedido.toISOString(),
      status: pedido.status,
      total: pedido.total.toFixed(2),
      quantidadeItens: pedido.itens.reduce(
        (sum: any, item: any) => sum + item.quantidade,
        0,
      ),
    }));

    registros.push({
      id: '',
      dataPedido: '',
      status: 'Total',
      total: totalVendas.toFixed(2),
      quantidadeItens: produtosVendidos,
    });

    await csvWriter.writeRecords(registros);

    return path.join('relatorios', `relatorio-${periodo}.csv`);
  }

  private parsePeriodo(periodo: string): [string, string] {
    const [inicio, fim] = periodo.split(':');
    return [inicio, fim];
  }
}
