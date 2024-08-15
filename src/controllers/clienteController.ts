/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response, NextFunction } from 'express';
import { ClienteService } from '../services/clienteService';
import { AppError } from '../utils/appError';
import { ParsedQs } from 'qs';

export class ClienteController {
  private clienteService: ClienteService;

  constructor() {
    this.clienteService = new ClienteService();
  }

  /**
   * @openapi
   * /api/clientes:
   *   post:
   *     summary: Cria um novo cliente
   *     tags: [Clientes]
   *     description: Adiciona um novo cliente ao sistema.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nomeCompleto:
   *                 type: string
   *                 example: João Silva
   *               contato:
   *                 type: string
   *                 example: (11) 98765-4321
   *               endereco:
   *                 type: string
   *                 example: Rua Exemplo, 123, São Paulo - SP
   *               status:
   *                 type: boolean
   *                 example: true
   *               usuarioId:
   *                 type: string
   *                 example: 123e4567-e89b-12d3-a456-426614174000
   *     responses:
   *       201:
   *         description: Cliente criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 cliente:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     nomeCompleto:
   *                       type: string
   *                     contato:
   *                       type: string
   *                     endereco:
   *                       type: string
   *                     status:
   *                       type: boolean
   *                     usuarioId:
   *                       type: string
   *       500:
   *         description: Erro ao criar cliente
   */
  async createCliente(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { nomeCompleto, contato, endereco, status, usuarioId } = req.body;
      const novoCliente = await this.clienteService.createCliente({
        nomeCompleto,
        contato,
        endereco,
        status,
        usuarioId,
      });
      res.status(201).json({ cliente: novoCliente });
    } catch (error) {
      next(new AppError('Erro ao criar cliente', 500));
    }
  }

  /**
   * @openapi
   * /api/clientes/{id}:
   *   get:
   *     summary: Obtém um cliente por ID
   *     tags: [Clientes]
   *     description: Retorna os detalhes de um cliente específico pelo ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do cliente
   *     responses:
   *       200:
   *         description: Cliente encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 cliente:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     nomeCompleto:
   *                       type: string
   *                     contato:
   *                       type: string
   *                     endereco:
   *                       type: string
   *                     status:
   *                       type: boolean
   *                     usuarioId:
   *                       type: string
   *       404:
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro ao buscar cliente
   */
  async getClienteById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.getClienteById(id);
      if (!cliente) {
        return next(new AppError('Cliente não encontrado', 404));
      }
      res.status(200).json({ cliente });
    } catch (error) {
      next(new AppError('Erro ao buscar cliente', 500));
    }
  }

  /**
   * @openapi
   * /api/clientes/{id}:
   *   put:
   *     summary: Atualiza um cliente existente
   *     tags: [Clientes]
   *     description: Atualiza os detalhes de um cliente específico pelo ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do cliente
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nomeCompleto:
   *                 type: string
   *                 example: João Silva
   *               contato:
   *                 type: string
   *                 example: (11) 98765-4321
   *               endereco:
   *                 type: string
   *                 example: Rua Exemplo, 123, São Paulo - SP
   *               status:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Cliente atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 cliente:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     nomeCompleto:
   *                       type: string
   *                     contato:
   *                       type: string
   *                     endereco:
   *                       type: string
   *                     status:
   *                       type: boolean
   *                     usuarioId:
   *                       type: string
   *       404:
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro ao atualizar cliente
   */
  async updateCliente(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { nomeCompleto, contato, endereco, status } = req.body;
      const clienteAtualizado = await this.clienteService.updateCliente(id, {
        nomeCompleto,
        contato,
        endereco,
        status,
      });
      if (!clienteAtualizado) {
        return next(new AppError('Cliente não encontrado', 404));
      }
      res.status(200).json({ cliente: clienteAtualizado });
    } catch (error) {
      next(new AppError('Erro ao atualizar cliente', 500));
    }
  }

  /**
   * @openapi
   * /api/clientes/{id}:
   *   delete:
   *     summary: Deleta um cliente
   *     tags: [Clientes]
   *     description: Remove um cliente do sistema pelo ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do cliente
   *     responses:
   *       204:
   *         description: Cliente deletado com sucesso
   *       404:
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro ao deletar cliente
   */
  async deleteCliente(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const clienteDeletado = await this.clienteService.deleteCliente(id);
      if (!clienteDeletado) {
        return next(new AppError('Cliente não encontrado', 404));
      }
      res.status(204).json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
      next(new AppError('Erro ao deletar cliente', 500));
    }
  }

  /**
   * @openapi
   * /api/clientes:
   *   get:
   *     summary: Lista todos os clientes
   *     tags: [Clientes]
   *     description: Retorna uma lista de clientes com base nos parâmetros de consulta.
   *     parameters:
   *       - in: query
   *         name: nomeCompleto
   *         schema:
   *           type: string
   *         description: Nome completo do cliente para filtragem
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *         description: Status do cliente para filtragem
   *     responses:
   *       200:
   *         description: Lista de clientes
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 clientes:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       nomeCompleto:
   *                         type: string
   *                       contato:
   *                         type: string
   *                       endereco:
   *                         type: string
   *                       status:
   *                         type: boolean
   *                       usuarioId:
   *                         type: string
   *       500:
   *         description: Erro ao listar clientes
   */
  async getClientes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const nomeCompleto = this.parseQueryParam(req.query.nomeCompleto);
      const status = req.query.status === 'true';
      const clientes = await this.clienteService.getClientes({
        nomeCompleto,
        status,
      });
      res.status(200).json({ clientes });
    } catch (error) {
      next(new AppError('Erro ao listar clientes', 500));
    }
  }

  private parseQueryParam(
    param: string | ParsedQs | string[] | ParsedQs[] | undefined,
  ): string | undefined {
    if (typeof param === 'string') {
      return param;
    }
    return undefined;
  }
}
