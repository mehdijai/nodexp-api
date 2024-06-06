import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { join } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { config } from 'dotenv';
import { OpenAPIDocInstance } from '@/utils/openApiGenerator';
import { writeFile } from 'fs/promises';
config();
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
  const instance = OpenAPIDocInstance.getInstance();

  // const json = JSON.stringify(instance);

  writeFile(join(__dirname, '../../public/schema.json'), JSON.stringify(instance, null, 2), {
    encoding: 'utf8',
  });
  writeFile(join(__dirname, '../../public/_schema.json'), JSON.stringify(specs, null, 2), {
    encoding: 'utf8',
  });

  app.use('/api-docs', (err: any, req: any, _: any, next: any) => {
    console.log(err, req);
    next();
  }, swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(instance));

  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(instance);
  });
};

export default setupSwagger;
