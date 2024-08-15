import { Router } from 'express';
import { RelatorioController } from '../controllers/relatorioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const relatorioController = new RelatorioController();

router.get('/relatorios', authMiddleware, (req, res, next) =>
  relatorioController.gerarRelatorio(req, res, next),
);

export default router;
