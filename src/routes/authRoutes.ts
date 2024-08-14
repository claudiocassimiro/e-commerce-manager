import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import {
  loginSchema,
  registerSchema,
} from '../utils/validations/authValidation';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next),
);
router.post('/login', validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next),
);

export default router;
