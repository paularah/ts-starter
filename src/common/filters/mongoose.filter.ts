import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import mongoose from 'mongoose';
import { Response } from 'express';

/**
 * filter to handle mongoose errors on that might slipped on a case by case basis
 * @todo type this properly to account to validation errors
 */
@Catch(mongoose.Error)
export class MongooseExceptionFilter<T extends mongoose.Error>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let exceptionMessage = exception.message;

    if (exception.name === 'CastError') {
      status = 404;
      exceptionMessage = 'Resource not Found';
    }

    response.status(status).json({
      sucess: false,
      error: exceptionMessage,
    });
  }
}
