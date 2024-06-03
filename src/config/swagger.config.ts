import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { join } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const controllersPath = join(__dirname, '../controllers/**/**/*.controller.ts');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: process.env.PROJECT_NAME ?? 'NodeExp',
    version: '1.0.0',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
    },
  ],
  externalDocs: {
    description: 'swagger.json',
    url: '/swagger.json',
  },
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [controllersPath],
};

const specs = swaggerJSDoc(options);

const setupSwagger = (app: Application): void => {
  app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default setupSwagger;
