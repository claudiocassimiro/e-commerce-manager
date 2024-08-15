/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { ProdutoService } from '../services/produtoService';
import { AppError } from '../utils/appError';

export class ProdutoController {
  private produtoService: ProdutoService;

  constructor() {
    this.produtoService = new ProdutoService();
  }

  /**
   * @swagger
   * /api/produtos:
   *   post:
   *     summary: Cria um novo produto
   *     tags: [Produtos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *               descricao:
   *                 type: string
   *               preco:
   *                 type: number
   *               quantidadeEmEstoque:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Produto criado com sucesso
   *       500:
   *         description: Erro ao criar produto
   */
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

  /**
   * @swagger
   * /api/produtos/{id}:
   *   get:
   *     summary: Busca um produto pelo ID
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do produto
   *     responses:
   *       200:
   *         description: Produto encontrado
   *       404:
   *         description: Produto não encontrado
   *       500:
   *         description: Erro ao buscar produto
   */
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

  /**
   * @swagger
   * /api/produtos/{id}:
   *   put:
   *     summary: Atualiza um produto pelo ID
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do produto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *               descricao:
   *                 type: string
   *               preco:
   *                 type: number
   *               quantidadeEmEstoque:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Produto atualizado com sucesso
   *       404:
   *         description: Produto não encontrado
   *       500:
   *         description: Erro ao atualizar produto
   */
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

  /**
   * @swagger
   * /api/produtos/{id}:
   *   delete:
   *     summary: Deleta um produto pelo ID
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do produto
   *     responses:
   *       204:
   *         description: Produto deletado com sucesso
   *       404:
   *         description: Produto não encontrado
   *       500:
   *         description: Erro ao deletar produto
   */
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

  /**
   * @swagger
   * /api/produtos:
   *   get:
   *     summary: Lista todos os produtos
   *     tags: [Produtos]
   *     parameters:
   *       - in: query
   *         name: precoMin
   *         schema:
   *           type: number
   *         required: false
   *         description: Preço mínimo para filtrar
   *       - in: query
   *         name: precoMax
   *         schema:
   *           type: number
   *         required: false
   *         description: Preço máximo para filtrar
   *       - in: query
   *         name: disponibilidade
   *         schema:
   *           type: boolean
   *         required: false
   *         description: Disponibilidade do produto
   *     responses:
   *       200:
   *         description: Lista de produtos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 produtos:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Produto'
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro ao listar produtos
   */
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
