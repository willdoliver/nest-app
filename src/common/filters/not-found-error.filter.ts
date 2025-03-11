import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { NotFoundError } from '../errors';
import { Response } from 'express';

export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).json({
      statusCode: 404,
      message: exception.message,
    });
  }
}
