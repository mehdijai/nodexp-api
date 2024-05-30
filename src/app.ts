import path from 'path';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandlerMiddleware';
import { notFoundHandler } from './middlewares/notFoundHandler';
import securityMiddleware from './middlewares/securityMiddleware';
import setupSwagger from './config/swagger.config';
import { config } from 'dotenv';
import { scanForControllers, registeredControllers } from './utils/ControllerScanner';

config();

export class App {
  app: Express;
  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.setupSwagger();
    this.setupControllers();
    this.setupRouter();
  }

  listen() {
    const PORT: number = parseInt(process.env.PORT as string, 10);
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

  private initMiddlewares() {
    // JSON Middleware & Form Data
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Security Middleware
    this.app.use(securityMiddleware);
  }

  private setupSwagger() {
    // Swagger Setup
    setupSwagger(this.app);
  }

  private setupControllers() {
    scanForControllers();

    registeredControllers.forEach((controllerClass) => {
      controllerClass.registerRoutes(this.app);
    });
  }
  private setupRouter() {
    // Routes Handling

    // Index page
    this.app.use(express.static(path.join(__dirname, '../public')));

    // Not Found Middleware
    this.app.all('*', notFoundHandler);

    // Error Handling Middleware
    this.app.use(errorHandler);
  }
}
