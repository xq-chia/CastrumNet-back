import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response, response } from 'express';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let ctx = host.switchToHttp();
    let res = ctx.getResponse<Response>();
    let req = ctx.getRequest<Request>();
    let status = exception.getStatus();

    res
      .status(status)
      .json({
        statusCode: status,
        msg: exception.message,
      })
  }
}
