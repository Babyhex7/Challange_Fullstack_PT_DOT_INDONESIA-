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
    let message: unknown = 'Internal server error';
    let details: unknown = null;

    // 1. Handle HttpException (NestJS built-in: BadRequest, NotFound, Unauthorized, dll)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, unknown>;
        message = obj.message || message;
        details = obj.details || null;
      } else {
        message = res;
      }
    }
    // 2. Handle database errors (Sequelize ORM)
    else if (this.isSequelizeError(exception)) {
      const errName = (exception as Record<string, unknown>).name as string;
      const errList = (exception as Record<string, unknown>).errors;

      if (errName === 'SequelizeUniqueConstraintError') {
        status = HttpStatus.CONFLICT;
        message = 'Data sudah ada (duplikat)';
        if (Array.isArray(errList)) {
          details = errList.map((e: Record<string, unknown>) => ({
            field: e.path,
            message: e.message,
          }));
        }
      } else if (errName === 'SequelizeForeignKeyConstraintError') {
        status = HttpStatus.CONFLICT;
        message =
          'Tidak bisa menghapus data karena masih terhubung dengan data lain';
      } else if (errName === 'SequelizeValidationError') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Validasi database gagal';
        if (Array.isArray(errList)) {
          details = errList.map((e: Record<string, unknown>) => ({
            field: e.path,
            message: e.message,
          }));
        }
      } else if (errName === 'SequelizeConnectionError') {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Koneksi database gagal. Silakan coba lagi nanti.';
      } else if (errName === 'SequelizeDatabaseError') {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Terjadi kesalahan pada database';
      }
    }
    // 3. Handle generic JS errors
    else if (exception instanceof Error) {
      message = exception.message || 'Internal server error';
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

  // Helper: cek apakah exception berasal dari Sequelize
  private isSequelizeError(exception: unknown): boolean {
    if (exception && typeof exception === 'object' && 'name' in exception) {
      const name = (exception as Record<string, unknown>).name;
      return typeof name === 'string' && name.startsWith('Sequelize');
    }
    return false;
  }
}
