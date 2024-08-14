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

  async getClientes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const nomeCompleto = this.parseQueryParam(req.query.nomeCompleto);
      console.log(nomeCompleto);
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
