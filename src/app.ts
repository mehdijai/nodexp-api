import path from 'path';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { notFoundHandler } from './middlewares/notFoundHandler';
import setupSwagger from './config/swagger.config';
import { config } from 'dotenv';
import { scanForControllers } from './utils/ControllerScanner';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'x-xss-protection';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
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
    const corsOptions = {
      origin: process.env.APP_ENV == 'development' ? '*' : process.env.ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204,
    };
    this.app.use(cors(corsOptions));

    // Helmet Middleware for various security headers
    this.app.use(helmet());

    // XSS (Cross-Site Scripting) Protection
    this.app.use(xss());

    // Cookie Parser
    this.app.use(cookieParser());

    // Rate Limiting to prevent abuse
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });
    this.app.use(limiter);
  }

  private setupSwagger() {
    // Swagger Setup
    setupSwagger(this.app);
  }

  private setupControllers() {
    scanForControllers(this.app);
  }
  private setupRouter() {
    // Routes Handling

    // Index page
    this.app.use(express.static(path.join(__dirname, '../public')));

    // Not Found Middleware
    this.app.all('*', notFoundHandler);

    // Error Handling Middleware
    // this.app.use(errorHandler);
  }
}
