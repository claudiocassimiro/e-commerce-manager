/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import clienteRoutes from './routes/clienteRoutes';
import produtoRoutes from './routes/produtoRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import relatorioRoutes from './routes/relatorioRoutes';

import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

class Server {
  private app: Application;
  private port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(helmet());
  }

  private routes(): void {
    this.app.use('/auth', authRoutes);
    this.app.use('/api', clienteRoutes);
    this.app.use('/api', produtoRoutes);
    this.app.use('/api', pedidoRoutes);

    this.app.use('/api', relatorioRoutes);

    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'API funcionando corretamente!' });
    });
  }

  private errorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }
}

const server = new Server();
server.start();
