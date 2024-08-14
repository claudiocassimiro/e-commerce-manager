/* eslint-disable @typescript-eslint/no-unused-vars */
// src/types/express.d.ts
import { Usuario } from '@prisma/client';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario; // ou qualquer tipo que você espera que seja decodificado
    }
  }
}
