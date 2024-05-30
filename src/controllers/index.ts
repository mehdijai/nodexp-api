import 'reflect-metadata';
import { Router, Express } from 'express';

interface Route {
  path: string;
  methodName: string;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
}

function HTTPMethodDecorator(route: Route, target: Object) {
  // Get existing routes or create an empty array
  const existingRoutes: Route[] = Reflect.getMetadata('routes', target.constructor.prototype) || [];

  // Store the path and method information
  existingRoutes.push(route);

  // Update the metadata with the combined routes
  Reflect.defineMetadata('routes', existingRoutes, target);
}

// Decorator for defining Express GET routes
export function Get(path: string) {
  return function (target: Object, propertyKey: string, _: PropertyDescriptor) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'get' }, target);
  };
}
// Decorator for defining Express GET routes
export function Post(path: string) {
  return function (target: Object, propertyKey: string, _: PropertyDescriptor) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'post' }, target);
  };
}
// Decorator for defining Express GET routes
export function Patch(path: string) {
  return function (target: Object, propertyKey: string, _: PropertyDescriptor) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'patch' }, target);
  };
}
// Decorator for defining Express GET routes
export function Put(path: string) {
  return function (target: Object, propertyKey: string, _: PropertyDescriptor) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'put' }, target);
  };
}
// Decorator for defining Express GET routes
export function Delete(path: string) {
  return function (target: Object, propertyKey: string, _: PropertyDescriptor) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'delete' }, target);
  };
}

export function Controller(version?: string, prefix?: string) {
  return function (target: Function) {
    Reflect.defineMetadata('prefix', prefix ?? '', target);
    Reflect.defineMetadata('version', version ?? '', target);
  };
}

export function API(summary: string, responses: any): Function {
  return function (target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata('api', { summary, responses }, target, propertyKey);
  };
}

// Base Controller class
export class _Controller {
  private static router = Router();
  public static registerRoutes(app: Express, controllerClass: any) {
    // Get routes defined on the class
    const routes = Reflect.getMetadata('routes', controllerClass.prototype);
    const prefix = Reflect.getMetadata('prefix', controllerClass) || '';
    const version = Reflect.getMetadata('version', controllerClass) || '';

    if (!routes) return;

    // Loop through routes and register them with Express
    routes.forEach((route: Route) => {
      const handler =
        controllerClass.prototype[route.methodName as keyof typeof controllerClass.prototype];
      switch (route.method) {
        case 'get':
          this.router.get(route.path, handler);
          break;
        case 'post':
          this.router.post(route.path, handler);
          break;
        case 'patch':
          this.router.patch(route.path, handler);
          break;
        case 'put':
          this.router.put(route.path, handler);
          break;
        case 'delete':
          this.router.delete(route.path, handler);
          break;
      }
    });

    app.use(version + prefix, this.router);
  }
}
export class BaseController extends _Controller {
  public static registerRoutes(app: Express) {
    _Controller.registerRoutes(app, this);
  }
}
