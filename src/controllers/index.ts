import 'reflect-metadata';
import { Router, Express, RequestHandler } from 'express';
import { authenticateJWT } from '@/middlewares/authMiddleware';
import MetadataService from '@/services/Metadata.service';
import { OpenAPIDocInstance } from '@/utils/openApiGenerator';
import { ZodObject, ZodRawShape } from 'zod';
import { parseZodObject, parseZodObjectRequest } from '@/utils/zodOpenApiParser';
import {
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  RequestBodyObject,
  ResponsesObject,
} from '@/types/openapi.type';
import { PoliciesVerbs } from '@/services/policies.service';
import { authorization } from '@/middlewares/authorization';

interface Route {
  path: string;
  methodName: string;
  summary?: string;
  description?: string;
  middlewares: RequestHandler[];
  params?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
  responses?: Record<string, string>;
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
export function Get(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'get', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Post(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'post', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Patch(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'patch', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Put(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'put', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function Delete(path: string, middlewares: RequestHandler[] = [], summary?: string) {
  return function (_: Object, propertyKey: string) {
    HTTPMethodDecorator({ path, methodName: propertyKey, method: 'delete', middlewares, summary });
  };
}
// Decorator for defining Express GET routes
export function AuthGuard() {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      match.middlewares.unshift(authenticateJWT);
    }
    MetadataService.set('routes', existingRoutes);
  };
}

export function Can(model: string, verb: PoliciesVerbs) {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      match.middlewares.push(authorization(model, verb));
    }
    MetadataService.set('routes', existingRoutes);
  };
}

export function Controller(name: string, version?: string, prefix?: string, description?: string) {
  return function (target: Function) {
    Reflect.defineMetadata('prefix', prefix ?? '', target);
    Reflect.defineMetadata('version', version ?? '', target);
    Reflect.defineMetadata('tag', name ?? '', target);
    const instance = OpenAPIDocInstance.getInstance();
    instance.addTag({
      name,
      description,
    });
  };
}

export function Query<T extends ZodRawShape>(obj: ZodObject<T>) {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      const typeEntries = Object.entries(obj.shape);
      typeEntries.forEach((item) => {
        const param = parseZodObject('query', item[0], item[1]);
        if (!match.params) {
          match.params = [];
        }
        match.params.push(param);
      });
    }
    MetadataService.set('routes', existingRoutes);
  };
}

export function RequestBody<T extends ZodRawShape>(obj: ZodObject<T>) {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    const val: RequestBodyObject = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    };

    if (match) {
      const typeEntries = Object.entries(obj.shape);
      typeEntries.forEach((item) => {
        const requestBody = parseZodObjectRequest(item[1]);
        // @ts-ignore
        val.content['application/json'].schema.properties[item[0]] = requestBody;
        match.requestBody = val;
      });
    }
    MetadataService.set('routes', existingRoutes);
  };
}

export function Param(value: { name: string; type: string; description?: string }[]) {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      value.forEach((item) => {
        const param = {
          name: item.name,
          in: 'path',
          description: item.description,
          required: true,
          allowEmptyValue: false,
          schema: {
            title: item.name,
            type: item.type,
            format: 'uuid',
          },
        };
        if (!match.params) {
          match.params = [];
        }
        match.params.push(param);
      });
    }
    MetadataService.set('routes', existingRoutes);
  };
}
export function Responses(value: Record<string, string>) {
  return function (_: Object, propertyKey: string) {
    const existingRoutes: Route[] = MetadataService.get('routes') || [];
    const match = existingRoutes.find((route) => route.methodName === propertyKey);

    if (match) {
      match.responses = value;
    }
    MetadataService.set('routes', existingRoutes);
  };
}

function parseDynamicRoute(path: string) {
  if (!path.includes(':')) return path;
  const dynamicParts = path.split('/');
  const newPath = [];
  for (let index = 0; index < dynamicParts.length; index++) {
    let part = dynamicParts[index];
    if (part.includes(':')) {
      part = `{${part.replace(/:/g, '')}}`;
    }
    newPath.push(part);
  }

  return newPath.join('/');
}

function parseResponses(responses?: Record<string, string>, hasAuth = false): ResponsesObject {
  const result: ResponsesObject = {};
  if (hasAuth) {
    result['401'] = {
      description: 'Unauthorized',
    };
  }
  if (!responses) {
    result['200'] = {
      description: '-',
    };
    return result;
  }

  Object.keys(responses).forEach((key) => {
    result[key] = {
      description: responses[key],
    };
  });

  return result;
}

// Base Controller class
export class BaseController {
  private router = Router();
  public _registerRoutes(app: Express, controllerClass: any) {
    // Get routes defined on the class
    const routes: Route[] = MetadataService.get('routes') || [];

    const prefix = Reflect.getMetadata('prefix', controllerClass.constructor) || '';
    const tag = Reflect.getMetadata('tag', controllerClass.constructor) || '';
    const version = Reflect.getMetadata('version', controllerClass.constructor) || '';

    // console.log(routes);

    if (!routes) return;

    // Loop through routes and register them with Express
    routes.forEach((route: Route) => {
      if (route.methodName in controllerClass) {
        const instance = OpenAPIDocInstance.getInstance();
        const pathElement: PathItemObject = {};
        pathElement[route.method] = {
          summary: route.summary,
          operationId: `${version}/${route.methodName}`,
          parameters: route.params,
          requestBody: route.requestBody,
          responses: parseResponses(route.responses, route.middlewares.includes(authenticateJWT)),
          security: route.middlewares.includes(authenticateJWT) ? [{ bearerAuth: [] }] : [],
          tags: [tag],
        };
        // if (route.middlewares.includes(authenticateJWT)) {
        //   // @ts-ignore
        //   pathElement[route.method].responses['401'] = { description: 'Unauthorized ' };
        // }
        const swaggerPath = parseDynamicRoute(version + prefix + route.path);
        instance.addPath(swaggerPath, pathElement);
        const handler: Function = controllerClass[route.methodName as keyof typeof controllerClass];
        this.router[route.method](route.path, ...route.middlewares, handler.bind(controllerClass));
      }
    });

    app.use(version + prefix, this.router);
  }
}
