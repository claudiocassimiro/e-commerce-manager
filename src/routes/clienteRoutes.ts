// src/routes/clienteRoutes.ts

import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { autorizeMiddleware } from '../middlewares/autorizeMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createClienteSchema,
  getClienteByIdSchema,
  updateClienteSchema,
  deleteClienteSchema,
  getClientesSchema,
} from '../utils/validations/clienteValidation';

const router = Router();
const clienteController = new ClienteController();

router.post(
  '/clientes',
  validate(createClienteSchema),
  authMiddleware,
  autorizeMiddleware(['ADMIN']),
  clienteController.createCliente.bind(clienteController),
);

router.get(
  '/clientes/:id',
  validate(getClienteByIdSchema),
  authMiddleware,
  autorizeMiddleware(['ADMIN', 'CLIENTE']),
  clienteController.getClienteById.bind(clienteController),
);

router.put(
  '/clientes/:id',
  validate(updateClienteSchema),
  authMiddleware,
  autorizeMiddleware(['ADMIN']),
  clienteController.updateCliente.bind(clienteController),
);

router.delete(
  '/clientes/:id',
  validate(deleteClienteSchema),
  authMiddleware,
  autorizeMiddleware(['ADMIN']),
  clienteController.deleteCliente.bind(clienteController),
);

router.get(
  '/clientes',
  validate(getClientesSchema),
  authMiddleware,
  autorizeMiddleware(['ADMIN', 'CLIENTE']),
  clienteController.getClientes.bind(clienteController),
);

export default router;
