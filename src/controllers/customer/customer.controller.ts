import { Request, Response, NextFunction } from 'express';
import {
  AuthGuard,
  BaseController,
  Controller,
  Delete,
  Get,
  Query,
  Patch,
  Post,
  Put,
  Param,
  Responses,
} from '..';
import { API_VERSION } from '@/config/version.config';
import {
  filterCustomerSchema,
  TCreateCustomerSchema,
  TFilterCustomerSchema,
  TUpdateCustomerSchema,
} from '@/validations/crm/customer';
import { AuthenticatedRequest } from '@/types/auth.types';
import { apiResponse, ResponseHandler } from '@/utils/responseHandler';
import CustomerService from '@/services/CRM/customer.service';

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer endpoints
 */
@Controller('Customer', API_VERSION, '/customers')
export default class CustomerController extends BaseController {
  constructor(protected customerService: CustomerService) {
    super();
  }

  @AuthGuard()
  @Responses({ '200': 'List of customers' })
  @Query(filterCustomerSchema)
  @Get('/', [], 'Get customers')
  public async getCustomers(
    req: Request<{}, {}, TFilterCustomerSchema>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customers = await this.customerService.getCustomers(req.query);
      apiResponse(response, customers);
    } catch (err) {
      next(err);
    }
  }

  @AuthGuard()
  @Responses({ '200': 'List of archived customers' })
  @Query(filterCustomerSchema)
  @Get('/archived', [], 'Get archived customers')
  public async getArchivedCustomers(
    req: Request<{}, {}, TFilterCustomerSchema>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customers = await this.customerService.getCustomers(req.query, true);
      apiResponse(response, customers);
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /customers:
   *   post:
   *     summary: Create customer
   *     tags: [Customer]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCustomer'
   *     responses:
   *       201:
   *         description: Created Customer
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Responses({ '201': 'Created Customer' })
  @Post('/', [], "Create customer")
  public async createCustomer(req: AuthenticatedRequest, response: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: TCreateCustomerSchema = req.body;
      const customer = await this.customerService.createCustomer(user.userId, body);
      apiResponse(response, customer);
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /customers:
   *   put:
   *     summary: Update customer
   *     tags: [Customer]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCustomer'
   *     responses:
   *       200:
   *         description: Updated Customer
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Put('/')
  public async updateCustomer(
    req: Request<{}, TUpdateCustomerSchema>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customer = await this.customerService.updateCustomer(req.body);
      if (!customer) {
        ResponseHandler.setResponse(response).NotFound('Customer not found');
      } else {
        apiResponse(response, customer);
      }
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /customers:
   *   delete:
   *     summary: Remove customer
   *     tags: [Customer]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IdBody'
   *     responses:
   *       200:
   *         description: Removed Customer
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Delete('/')
  public async removeCustomer(
    req: Request<{}, { id: string }>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customer = await this.customerService.removeCustomer(req.body.id);
      if (!customer) {
        ResponseHandler.setResponse(response).NotFound('Customer not found');
      } else {
        apiResponse(response, customer);
      }
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /customers:
   *   patch:
   *     summary: Restore removed customer
   *     tags: [Customer]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IdBody'
   *     responses:
   *       200:
   *         description: Restored Customer
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Patch('/')
  public async restoreCustomer(
    req: Request<{}, { id: string }>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customer = await this.customerService.restoreCustomer(req.body.id);
      if (!customer) {
        ResponseHandler.setResponse(response).NotFound('Customer not found');
      } else {
        apiResponse(response, customer);
      }
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /customers/hard:
   *   delete:
   *     summary: Hard delete customer
   *     tags: [Customer]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/IdBody'
   *     responses:
   *       200:
   *         description: Deleted Customer
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Delete('/hard')
  public async deleteCustomer(
    req: Request<{}, { id: string }>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customer = await this.customerService.deleteCustomer(req.body.id);
      if (!customer) {
        ResponseHandler.setResponse(response).NotFound('Customer not found');
      } else {
        apiResponse(response, customer);
      }
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /customers/{id}:
   *   get:
   *     summary: Get customer
   *     tags: [Customer]
   *     parameters:
   *        - $ref: '#/components/parameters/id'
   *     responses:
   *       200:
   *         description: Customer
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Param([{ name: 'id', type: 'string' }])
  @Get('/:id')
  public async getCustomer(req: Request<{ id: string }>, response: Response, next: NextFunction) {
    try {
      const customer = await this.customerService.getCustomer(req.params.id);
      if (!customer) {
        ResponseHandler.setResponse(response).NotFound('Customer not found');
      } else {
        apiResponse(response, customer);
      }
    } catch (err) {
      next(err);
    }
  }
}
