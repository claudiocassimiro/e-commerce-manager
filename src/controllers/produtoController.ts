/* eslint-disable @typescript-eslint/no-unused-vars */
// src/controllers/produtoController.ts

import { Request, Response, NextFunction } from 'express';
import { ProdutoService } from '../services/produtoService';
import { AppError } from '../utils/appError';

export class ProdutoController {
  private produtoService: ProdutoService;

  constructor() {
    this.produtoService = new ProdutoService();
  }

  async createProduto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { nome, descricao, preco, quantidadeEmEstoque } = req.body;
      const novoProduto = await this.produtoService.createProduto({
        nome,
        descricao,
        preco,
        quantidadeEmEstoque,
      });
      res.status(201).json({ produto: novoProduto });
    } catch (error) {
      next(new AppError('Erro ao criar produto', 500));
    }
  }

  async getProdutoById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const produto = await this.produtoService.getProdutoById(id);
      if (!produto) {
        return next(new AppError('Produto não encontrado', 404));
      }
      res.status(200).json({ produto });
    } catch (error) {
      next(new AppError('Erro ao buscar produto', 500));
    }
  }

  async updateProduto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, quantidadeEmEstoque } = req.body;
      const produtoAtualizado = await this.produtoService.updateProduto(id, {
        nome,
        descricao,
        preco,
        quantidadeEmEstoque,
      });
      if (!produtoAtualizado) {
        return next(new AppError('Produto não encontrado', 404));
      }
      res.status(200).json({ produto: produtoAtualizado });
    } catch (error) {
      next(new AppError('Erro ao atualizar produto', 500));
    }
  }

  async deleteProduto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const produtoDeletado = await this.produtoService.deleteProduto(id);
      if (!produtoDeletado) {
        return next(new AppError('Produto não encontrado', 404));
      }
      res.status(204).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      next(new AppError('Erro ao deletar produto', 500));
    }
  }

  async getProdutos(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { precoMin, precoMax, disponibilidade } = req.query;

      if (precoMin && precoMax && precoMin > precoMax) {
        next(
          new AppError(
            'O preço minimo não pode ser maior que o preço máximo',
            400,
          ),
        );
      }

      const produtos = await this.produtoService.getProdutos(
        precoMin ? Number(precoMin) : undefined,
        precoMax ? Number(precoMax) : undefined,
        disponibilidade ? disponibilidade === 'true' : undefined,
      );
      res.status(200).json({ produtos });
    } catch (error) {
      next(new AppError('Erro ao listar produtos', 500));
    }
  }
}
