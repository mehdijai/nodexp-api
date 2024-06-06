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
  RequestBody,
} from '..';
import { API_VERSION } from '@/config/version.config';
import {
  createCustomerSchema,
  filterCustomerSchema,
  TCreateCustomerSchema,
  TFilterCustomerSchema,
  TUpdateCustomerSchema,
  updateCustomerSchema,
} from '@/validations/crm/customer';
import { AuthenticatedRequest } from '@/types/auth.types';
import { apiResponse, ResponseHandler } from '@/utils/responseHandler';
import CustomerService from '@/services/CRM/customer.service';
import { idBodySchema, TIdBodySchema } from '@/validations';

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

  @AuthGuard()
  @Responses({ '201': 'Created Customer' })
  @RequestBody(createCustomerSchema)
  @Post('/', [], 'Create customer')
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

  @AuthGuard()
  @Responses({ '200': 'Updated Customer' })
  @RequestBody(updateCustomerSchema)
  @Put('/', [], 'Update customer')
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

  @AuthGuard()
  @Responses({ '200': 'Removed Customer' })
  @RequestBody(idBodySchema)
  @Delete('/', [], 'Remove customer')
  public async removeCustomer(
    req: Request<{}, TIdBodySchema>,
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

  @AuthGuard()
  @Responses({ '200': 'Restored Customer' })
  @RequestBody(idBodySchema)
  @Patch('/', [], 'Restore customer')
  public async restoreCustomer(
    req: Request<{}, TIdBodySchema>,
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

  @AuthGuard()
  @Responses({ '200': 'Deleted Customer' })
  @RequestBody(idBodySchema)
  @Delete('/hard', [], 'Hard delete customer')
  public async deleteCustomer(
    req: Request<{}, TIdBodySchema>,
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

  @AuthGuard()
  @Responses({ '200': 'Customer object' })
  @Param([{ name: 'id', type: 'string' }])
  @Get('/:id', [], 'Get one customer')
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
