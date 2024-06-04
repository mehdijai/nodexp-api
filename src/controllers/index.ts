import { Router, Express, RequestHandler } from 'express';
import { authenticateJWT } from '@/middlewares/authMiddleware';
import MetadataService from '@/services/Metadata.service';

interface Route {
  path: string;
  methodName: string;
  middlewares: RequestHandler[];
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
}

function HTTPMethodDecorator(route: Route) {
  // Get existing routes or create an empty array
  const existingRoutes: Route[] = MetadataService.get('routes') || [];

  // Store the path and method information
  existingRoutes.push(route);

  // Update the metadata with the combined routes
  MetadataService.set('routes', existingRoutes);
}

// Decorator for defining Express GET routes
export function Get(path: string, middlewares: RequestHandler[] = []) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'get', middlewares });
  };
}
// Decorator for defining Express GET routes
export function Post(path: string, middlewares: RequestHandler[] = []) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'post', middlewares });
  };
}
// Decorator for defining Express GET routes
export function Patch(path: string, middlewares: RequestHandler[] = []) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'patch', middlewares });
  };
}
// Decorator for defining Express GET routes
export function Put(path: string, middlewares: RequestHandler[] = []) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'put', middlewares });
  };
}
// Decorator for defining Express GET routes
export function Delete(path: string, middlewares: RequestHandler[] = []) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'delete', middlewares });
  };
}
// Decorator for defining Express GET routes
export function AuthGuard() {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      match.middlewares.push(authenticateJWT);
    }
    MetadataService.set('routes', existingRoutes);
  };
}

export function Controller(version?: string, prefix?: string) {
  return function (_: Function) {
    MetadataService.set('prefix', prefix ?? '');
    MetadataService.set('version', version ?? '');
  };
}

// Base Controller class
export class BaseController {
  private router = Router();
  public _registerRoutes(app: Express, controllerClass: any) {
    // Get routes defined on the class
    const routes = MetadataService.get('routes');
    const prefix = MetadataService.get('prefix') || '';
    const version = MetadataService.get('version') || '';

    // console.log(routes);

    if (!routes) return;

    // Loop through routes and register them with Express
    routes.forEach((route: Route) => {
      if (route.methodName in controllerClass) {
        const handler: Function = controllerClass[route.methodName as keyof typeof controllerClass];
        this.router[route.method](route.path, ...route.middlewares, handler.bind(controllerClass));
      }
    });

    app.use(version + prefix, this.router);
  }
}
