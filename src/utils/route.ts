import { Router } from 'express';

export class ApiRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  protected setupRoutes() {}
}
