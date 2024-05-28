import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { join } from 'path';

const routePath = join(__dirname, '../../src/**/*.route.ts');
const routeChildPath = join(__dirname, '../../src/**/*.route.ts');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Open API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [routePath, routeChildPath],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app: Application): void => {
  app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
