import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { AppHttpException, AppErrorCodes } from '../errors/common-errors';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject('DEFAULT_ERROR_CODE') private readonly defaultErrorCode: number) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Initialize defaults
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: number;
    let message: string = AppErrorCodes.UNKNOWN_ERROR.message;

    if (exception instanceof AppHttpException) {
      // Enterprise known error with explicit code
      code = exception.getCode();
      status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message ?? AppErrorCodes.UNKNOWN_ERROR.message;
    } else if (exception instanceof HttpException) {
      // Nest HttpException but not our AppHttpException
      status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      const exAny: unknown = exception;
      // Try to read a code if provided by custom HttpException
      const hasGetCode = (ex: unknown): ex is { getCode: () => number } => {
        return typeof (ex as { getCode?: unknown }).getCode === 'function';
      };
      code = hasGetCode(exAny)
        ? (exAny as { getCode: () => number }).getCode()
        : (this.defaultErrorCode ?? AppErrorCodes.INTERNAL_ERROR.code);
      message = (exception as HttpException).message ?? AppErrorCodes.INTERNAL_ERROR.message;
    } else {
      // Unknown error
      code = AppErrorCodes.UNKNOWN_ERROR.code;
      message = AppErrorCodes.UNKNOWN_ERROR.message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({ code, data: null, message });
  }
}
