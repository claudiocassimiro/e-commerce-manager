/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';
import { AppError } from '../utils/appError';

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      return next(new AppError(`Erro de validação: ${err.errors}`, 400));
    }
  };
