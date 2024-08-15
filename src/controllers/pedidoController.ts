/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { PedidoService } from '../services/pedidoService';
import { AppError } from '../utils/appError';
import { ItemDoPedido } from '@prisma/client';
import { calculateTotal } from '../utils/calculateTotal';

export class PedidoController {
  private pedidoService: PedidoService;

  constructor() {
    this.pedidoService = new PedidoService();
  }

  async createPedido(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { idCliente, itens } = req.body; // Expecta que itens seja um array de objetos
      const total = calculateTotal(itens);
      const novoPedido = await this.pedidoService.createPedido(
        idCliente,
        total,
        itens,
      );
      res.status(201).json({ pedido: novoPedido });
    } catch (error) {
      console.log(error);
      next(new AppError('Erro ao criar pedido', 500));
    }
  }

  async getAllPedidos(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const pedidos = await this.pedidoService.getAllPedidos();
      res.status(200).json({ pedidos });
    } catch (error) {
      next(new AppError('Erro ao listar pedidos', 500));
    }
  }

  async getPedidoById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      console.log('>>>>>>>', id);
      const pedido = await this.pedidoService.getPedidoById(id);
      console.log(pedido);
      if (!pedido) {
        return next(new AppError('Pedido não encontrado', 404));
      }
      res.status(200).json({ pedido });
    } catch (error) {
      next(new AppError('Erro ao buscar pedido', 500));
    }
  }

  async updatePedido(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status, itens } = req.body; // Atualiza o status e itens
      const total = calculateTotal(itens);
      const pedidoAtualizado = await this.pedidoService.updatePedido(id, {
        status,
        itens,
        total,
      });
      if (!pedidoAtualizado) {
        return next(new AppError('Pedido não encontrado', 404));
      }
      res.status(200).json({ pedido: pedidoAtualizado });
    } catch (error) {
      next(new AppError('Erro ao atualizar pedido', 500));
    }
  }

  async deletePedido(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const pedidoDeletado = await this.pedidoService.deletePedido(id);
      if (!pedidoDeletado) {
        return next(new AppError('Pedido não encontrado', 404));
      }
      res.status(204).json({ message: 'Pedido deletado com sucesso' });
    } catch (error) {
      next(new AppError('Erro ao deletar pedido', 500));
    }
  }
}
