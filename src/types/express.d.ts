/* eslint-disable @typescript-eslint/no-unused-vars */
// src/types/express.d.ts

import { User } from '../models/userModel'; // Importe o tipo de usuário, se necessário
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User; // ou qualquer tipo que você espera que seja decodificado
    }
  }
}
