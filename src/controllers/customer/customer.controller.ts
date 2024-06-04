import { Request, Response, NextFunction } from 'express';
import { AuthGuard, BaseController, Controller, Delete, Get, Patch, Post, Put } from '..';
import { API_VERSION } from '@/config/version.config';
import {
  TCreateCustomerSchema,
  TFilterCustomerSchema,
  TUpdateCustomerSchema,
} from '@/validations/crm/customer';
import { AuthenticatedRequest } from '@/types/auth.types';
import { sendNotFoundResponse } from '@/utils/responseHandler';
import CustomerService from '@/services/CRM/customer.service';

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer endpoints
 * components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    parameters:
 *        take:
 *          in: query
 *          name: take
 *          schema:
 *            type: integer
 *            format: int32
 *          required: false
 *          description: Number of elements per request
 *        skip:
 *          in: query
 *          name: take
 *          schema:
 *            type: integer
 *            format: int32
 *          required: false
 *          description:  Number of elements to skip per request
 *        searchQuery:
 *          in: query
 *          name: query
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by search query, to search for name, email, and phone
 *        type:
 *          in: query
 *          name: type
 *          schema:
 *            type: string
 *            enum:
 *             - Particulier
 *             - Entreprise
 *          required: false
 *          description:  Filter by type
 *        gender:
 *          in: query
 *          name: gender
 *          schema:
 *            type: string
 *            enum:
 *              - M.
 *              - F.
 *          required: false
 *          description:  Filter by customer gender
 *        zipCode:
 *          in: query
 *          name: zipCode
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by zipCode
 *        city:
 *          in: query
 *          name: city
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by city
 *        country:
 *          in: query
 *          name: country
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by country
 *        companyId:
 *          in: query
 *          name: companyId
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by companyId
 *        statut:
 *          in: query
 *          name: statut
 *          schema:
 *            type: string
 *            enum:
 *              - Active
 *              - Inactive
 *              - Encours
 *          required: false
 *          description:  Filter by statut
 *    schemas:
 *      CreateCustomer:
 *        type: object
 *        properties:
 *          type:
 *            type: string
 *            example: Particulier
 *            description: Customer Type
 *            required: true
 *            enum:
 *              - Particulier
 *              - Entreprise
 *          gender:
 *            type: string
 *            example: M.
 *            description: Customer Gender
 *            required: true
 *            enum:
 *              - M.
 *              - F.
 *          firstname:
 *            type: string
 *            example: Mehdi
 *            description: Customer first name
 *            required: true
 *          lastname:
 *            type: string
 *            example: Jai
 *            description: Customer last name
 *            required: true
 *          phone:
 *            type: string
 *            example: +21261234638
 *            description: Customer phone number
 *            required: true
 *          email:
 *            type: string
 *            format: email
 *            example: mail@mail.com
 *            description: Customer email
 *            required: true
 *          adresse:
 *            type: string
 *            example: street 1 av 1 city, country
 *            description: Customer address
 *            required: false
 *          zipCode:
 *            type: string
 *            example: 20000
 *            description: Customer address zip code
 *            required: false
 *          city:
 *            type: string
 *            example: Casablanca
 *            description: Customer address city
 *            required: false
 *          country:
 *            type: string
 *            example: Morocco
 *            description: Customer address country
 *            required: false
 *          companyId:
 *            type: string
 *            format: uuid
 *            description: Customer linked company uuid
 *            required: false
 *          statut:
 *            type: string
 *            description: Customer status
 *            required: false
 *            enum:
 *              - Active
 *              - Inactive
 *              - Encours
 *      UpdateCustomer:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            description: Customer id
 *            required: true
 *          type:
 *            type: string
 *            example: Particulier
 *            description: Customer Type
 *            required: true
 *            enum:
 *              - Particulier
 *              - Entreprise
 *          gender:
 *            type: string
 *            example: M.
 *            description: Customer Gender
 *            required: true
 *            enum:
 *              - M.
 *              - F.
 *          firstname:
 *            type: string
 *            example: Mehdi
 *            description: Customer first name
 *            required: true
 *          lastname:
 *            type: string
 *            example: Jai
 *            description: Customer last name
 *            required: true
 *          phone:
 *            type: string
 *            example: +21261234638
 *            description: Customer phone number
 *            required: true
 *          email:
 *            type: string
 *            format: email
 *            example: mail@mail.com
 *            description: Customer email
 *            required: true
 *          adresse:
 *            type: string
 *            example: street 1 av 1 city, country
 *            description: Customer address
 *            required: false
 *          zipCode:
 *            type: string
 *            example: 20000
 *            description: Customer address zip code
 *            required: false
 *          city:
 *            type: string
 *            example: Casablanca
 *            description: Customer address city
 *            required: false
 *          country:
 *            type: string
 *            example: Morocco
 *            description: Customer address country
 *            required: false
 *          companyId:
 *            type: string
 *            format: uuid
 *            description: Customer linked company uuid
 *            required: false
 *          statut:
 *            type: string
 *            description: Customer status
 *            required: false
 *            enum:
 *              - Active
 *              - Inactive
 *              - Encours
 */
@Controller(API_VERSION, '/customers')
export default class CustomerController extends BaseController {
  constructor(protected customerService: CustomerService) {
    super();
  }
  /**
   * @swagger
   * /customers:
   *   get:
   *     summary: Get customers
   *     tags: [Customer]
   *     parameters:
   *        - $ref: '#/components/parameters/take'
   *        - $ref: '#/components/parameters/skip'
   *        - $ref: '#/components/parameters/searchQuery'
   *        - $ref: '#/components/parameters/type'
   *        - $ref: '#/components/parameters/gender'
   *        - $ref: '#/components/parameters/zipCode'
   *        - $ref: '#/components/parameters/city'
   *        - $ref: '#/components/parameters/country'
   *        - $ref: '#/components/parameters/statut'
   *     responses:
   *       200:
   *         description: List of customers
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Get('/')
  public async getCustomers(
    req: Request<{}, {}, TFilterCustomerSchema>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customers = await this.customerService.getCustomers(req.query);
      response.json(customers);
    } catch (err) {
      next(err);
    }
  }
  /**
   * @swagger
   * /customers/archived:
   *   get:
   *     summary: Get archived customers
   *     tags: [Customer]
   *     parameters:
   *        - $ref: '#/components/parameters/take'
   *        - $ref: '#/components/parameters/skip'
   *        - $ref: '#/components/parameters/searchQuery'
   *        - $ref: '#/components/parameters/type'
   *        - $ref: '#/components/parameters/gender'
   *        - $ref: '#/components/parameters/zipCode'
   *        - $ref: '#/components/parameters/city'
   *        - $ref: '#/components/parameters/country'
   *        - $ref: '#/components/parameters/statut'
   *     responses:
   *       200:
   *         description: List of customers
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Get('/archived')
  public async getArchivedCustomers(
    req: Request<{}, {}, TFilterCustomerSchema>,
    response: Response,
    next: NextFunction
  ) {
    try {
      const customers = await this.customerService.getCustomers(req.query, true);
      response.json(customers);
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
  @Post('/')
  public async createCustomer(req: AuthenticatedRequest, response: Response, next: NextFunction) {
    try {
      const user = req.user;
      const body: TCreateCustomerSchema = req.body;
      const customer = await this.customerService.createCustomer(user.userId, body);
      response.json(customer);
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
        sendNotFoundResponse(response, 'Customer not found');
      } else {
        response.json(customer);
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
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 format: uuid
   *                 description: Customer id
   *                 required: true
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
        sendNotFoundResponse(response, 'Customer not found');
      } else {
        response.json(customer);
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
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 format: uuid
   *                 description: Customer id
   *                 required: true
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
        sendNotFoundResponse(response, 'Customer not found');
      } else {
        response.json(customer);
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
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *                 format: uuid
   *                 description: Customer id
   *                 required: true
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
        sendNotFoundResponse(response, 'Customer not found');
      } else {
        response.json(customer);
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
   *        - in: path
   *          name: id
   *          required: true
   *          type: string
   *          format: uuid
   *          description: The customer ID
   *     responses:
   *       200:
   *         description: Customer
   *       401:
   *         description: Unauthorized
   *     security:
   *       - bearerAuth: []
   */
  @AuthGuard()
  @Get('/:id')
  public async getCustomer(req: Request<{ id: string }>, response: Response, next: NextFunction) {
    try {
      const customer = await this.customerService.getCustomer(req.params.id);
      if (!customer) {
        sendNotFoundResponse(response, 'Customer not found');
      } else {
        response.json(customer);
      }
    } catch (err) {
      next(err);
    }
  }
}
