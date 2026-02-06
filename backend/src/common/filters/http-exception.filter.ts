// Global Exception Filter - tangani semua error dan format response
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        details = (exceptionResponse as any).details || null;
      } else {
        message = exceptionResponse as string;
      }
    }

    // Log error untuk debugging
    console.error('Exception:', exception);

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
