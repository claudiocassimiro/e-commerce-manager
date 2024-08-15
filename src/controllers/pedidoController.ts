/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { PedidoService } from '../services/pedidoService';
import { AppError } from '../utils/appError';
import { calculateTotal } from '../utils/calculateTotal';

export class PedidoController {
  private pedidoService: PedidoService;

  constructor() {
    this.pedidoService = new PedidoService();
  }

  /**
   * @swagger
   * /api/pedidos:
   *   post:
   *     summary: Cria um novo pedido
   *     tags: [Pedidos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               idCliente:
   *                 type: string
   *                 description: ID do cliente
   *               itens:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     idProduto:
   *                       type: string
   *                       description: ID do produto
   *                     quantidade:
   *                       type: number
   *                       description: Quantidade do produto
   *                     precoPorUnidade:
   *                       type: number
   *                       description: Preco por unidade do produto
   *                     subtotal:
   *                       type: number
   *                       description: Subtotal do pedido
   *     responses:
   *       201:
   *         description: Pedido criado com sucesso
   *       500:
   *         description: Erro ao criar pedido
   */
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
      next(new AppError('Erro ao criar pedido', 500));
    }
  }

  /**
   * @swagger
   * /api/pedidos:
   *   get:
   *     summary: Lista todos os pedidos
   *     tags: [Pedidos]
   *     responses:
   *       200:
   *         description: Lista de pedidos
   *       500:
   *         description: Erro ao listar pedidos
   */
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

  /**
   * @swagger
   * /api/pedidos/{id}:
   *   get:
   *     summary: Obtém um pedido pelo ID
   *     tags: [Pedidos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do pedido
   *     responses:
   *       200:
   *         description: Pedido encontrado
   *       404:
   *         description: Pedido não encontrado
   *       500:
   *         description: Erro ao buscar pedido
   */
  async getPedidoById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const pedido = await this.pedidoService.getPedidoById(id);
      if (!pedido) {
        return next(new AppError('Pedido não encontrado', 404));
      }
      res.status(200).json({ pedido });
    } catch (error) {
      next(new AppError('Erro ao buscar pedido', 500));
    }
  }

  /**
   * @swagger
   * /api/pedidos/{id}:
   *   put:
   *     summary: Atualiza um pedido
   *     tags: [Pedidos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do pedido
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 description: Status do pedido
   *               itens:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     produtoId:
   *                       type: string
   *                     quantidade:
   *                       type: number
   *     responses:
   *       200:
   *         description: Pedido atualizado com sucesso
   *       404:
   *         description: Pedido não encontrado
   *       500:
   *         description: Erro ao atualizar pedido
   */
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

  /**
   * @swagger
   * /api/pedidos/{id}:
   *   delete:
   *     summary: Deleta um pedido
   *     tags: [Pedidos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do pedido
   *     responses:
   *       204:
   *         description: Pedido deletado com sucesso
   *       404:
   *         description: Pedido não encontrado
   *       500:
   *         description: Erro ao deletar pedido
   */
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
