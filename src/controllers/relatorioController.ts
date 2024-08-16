/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { RelatorioService } from '../services/relatorioService';
import { AppError } from '../utils/appError';

export class RelatorioController {
  private relatorioService: RelatorioService;

  constructor() {
    this.relatorioService = new RelatorioService();
  }

  /**
   * @swagger
   * /api/relatorios:
   *   get:
   *     summary: Gera um relatório de vendas baseado em um período especificado.
   *     tags: [Relatórios]
   *     parameters:
   *       - in: query
   *         name: periodo
   *         schema:
   *           type: string
   *         required: true
   *         description: O período para o qual o relatório deve ser gerado (por exemplo, "2024-01" para janeiro de 2024).
   *     responses:
   *       200:
   *         description: Relatório gerado com sucesso e pronto para download.
   *         content:
   *           application/octet-stream:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Período não especificado ou inválido.
   *       500:
   *         description: Erro interno ao gerar o relatório.
   */
  async gerarRelatorio(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { periodo } = req.query;
      if (!periodo) {
        throw new AppError('Período não especificado', 400);
      }

      const relatorioPath = await this.relatorioService.gerarRelatorio(
        periodo as string,
      );
      res.download(relatorioPath);
    } catch (error) {
      next(new AppError('Período não especificado', 400));
    }
  }
}
