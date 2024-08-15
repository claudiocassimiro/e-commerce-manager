// src/controllers/relatorioController.ts

import { Request, Response, NextFunction } from 'express';
import { RelatorioService } from '../services/relatorioService';
import { AppError } from '../utils/appError';

export class RelatorioController {
  private relatorioService: RelatorioService;

  constructor() {
    this.relatorioService = new RelatorioService();
  }

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
      next(error);
    }
  }
}
