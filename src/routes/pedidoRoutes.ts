import { Router } from 'express';
import { PedidoController } from '../controllers/pedidoController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createPedidoSchema,
  updatePedidoSchema,
  getPedidosSchema,
} from '../utils/validations/pedidosValidation';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const pedidoController = new PedidoController();

router.post(
  '/pedidos',
  validate(createPedidoSchema),
  authMiddleware,
  pedidoController.createPedido.bind(pedidoController),
);
router.get(
  '/pedidos',
  validate(getPedidosSchema),
  authMiddleware,
  pedidoController.getAllPedidos.bind(pedidoController),
);
router.get(
  '/pedidos/:id',
  authMiddleware,
  pedidoController.getPedidoById.bind(pedidoController),
);
router.put(
  '/pedidos/:id',
  validate(updatePedidoSchema),
  authMiddleware,
  pedidoController.updatePedido.bind(pedidoController),
);
router.delete(
  '/pedidos/:id',
  authMiddleware,
  pedidoController.deletePedido.bind(pedidoController),
);

export default router;
