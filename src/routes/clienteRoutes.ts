// src/routes/clienteRoutes.ts

import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { autorizeMiddleware } from '../middlewares/autorizeMiddleware';

const router = Router();
const clienteController = new ClienteController();

router.post(
  '/clientes',
  authMiddleware,
  autorizeMiddleware(['ADMIN']),
  clienteController.createCliente.bind(clienteController),
);

router.get(
  '/clientes/:id',
  authMiddleware,
  autorizeMiddleware(['ADMIN', 'CLIENTE']),
  clienteController.getClienteById.bind(clienteController),
);

router.put(
  '/clientes/:id',
  authMiddleware,
  autorizeMiddleware(['ADMIN']),
  clienteController.updateCliente.bind(clienteController),
);

router.delete(
  '/clientes/:id',
  authMiddleware,
  autorizeMiddleware(['ADMIN']),
  clienteController.deleteCliente.bind(clienteController),
);

router.get(
  '/clientes',
  authMiddleware,
  autorizeMiddleware(['ADMIN', 'CLIENTE']),
  clienteController.getClientes.bind(clienteController),
);

export default router;
