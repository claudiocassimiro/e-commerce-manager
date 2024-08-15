import { Router } from 'express';
import { ProdutoController } from '../controllers/produtoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createProdutoSchema,
  updateProdutoSchema,
} from '../utils/validations/produtoValidation';

const router = Router();
const produtoController = new ProdutoController();

router.post(
  '/produtos',
  validate(createProdutoSchema),
  authMiddleware,
  produtoController.createProduto.bind(produtoController),
);
router.get(
  '/produtos/:id',
  produtoController.getProdutoById.bind(produtoController),
);
router.put(
  '/produtos/:id',
  authMiddleware,
  validate(updateProdutoSchema),
  produtoController.updateProduto.bind(produtoController),
);
router.delete(
  '/produtos/:id',
  authMiddleware,
  produtoController.deleteProduto.bind(produtoController),
);
router.get('/produtos', produtoController.getProdutos.bind(produtoController));

export default router;
