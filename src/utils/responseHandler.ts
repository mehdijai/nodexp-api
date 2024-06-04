import { Response } from 'express';
import HttpStatusCode from './HttpStatusCode';

export class ApiResponseBody<T = undefined> {
  public success: boolean = false;
  public error?: any;
  public data?: T;
}

export function apiResponse<T = any>(
  res: Response,
  data?: T,
  statusCode: HttpStatusCode = HttpStatusCode.OK,
  err?: any
) {
  const response = new ApiResponseBody<T>();
  if (err) {
    response.success = false;
    response.error = err;
    res.status(statusCode).json(response);
  } else {
    response.success = true;
    response.data = data;
    res.status(HttpStatusCode.OK).json(response);
  }
}

export class ResponseHandler {
  static res: Response;
  static response(message: any, status: HttpStatusCode) {
    apiResponse(this.res, undefined, status, message);
  }
  static setResponse(res: Response) {
    this.res = res;
    return this;
  }
  static NoDataResponse(message: any = 'Operation successful') {
    this.response(message, HttpStatusCode.OK);
  }
  static NotFound(message: any = 'Not found') {
    this.response(message, HttpStatusCode.NOT_FOUND);
  }
  static InvalidBody(message: any = 'Invalid request body') {
    this.response(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
  }
  static Unauthorized(message: any = 'Unauthorized') {
    this.response(message, HttpStatusCode.UNAUTHORIZED);
  }
  static Forbidden(message: any = 'Forbidden') {
    this.response(message, HttpStatusCode.FORBIDDEN);
  }
  static BadRequest(message: any = 'Bad Request') {
    this.response(message, HttpStatusCode.BAD_REQUEST);
  }
}
