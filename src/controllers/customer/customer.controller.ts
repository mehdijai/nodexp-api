import { Request, Response, NextFunction } from 'express';
import { _Controller, AuthGuard, BaseController, Controller, Get } from '..';
import { API_VERSION } from '@/config/version.config';
import { getCustomers } from '@/services/customer.service';

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer endpoints
 */
@Controller(API_VERSION, '/customers')
export default class CustomerController extends BaseController {
  /**
   * @swagger
   * /customer:
   *   get:
   *     summary: Get customer
   *     tags: [Customer]
   *     responses:
   *       200:
   *         description: List of customers
   *       401:
   *         description: Unauthorized
   */
  @AuthGuard()
  @Get('/')
  public async getCustomers(_: Request, response: Response, next: NextFunction) {
    try {
      const customers = await getCustomers();
      response.json(customers);
    } catch (err) {
      next(err);
    }
  }
}
