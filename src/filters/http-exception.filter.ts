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

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject('DEFAULT_ERROR_CODE') private readonly defaultErrorCode: number) {}

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    interface IMaybeCodeGetter {
      getCode?: () => number;
    }
    const exWithCode = exception as IMaybeCodeGetter;
    const code: number =
      typeof exWithCode.getCode === 'function'
        ? exWithCode.getCode()
        : (this.defaultErrorCode ?? 9000);
    const message = exception.message ?? 'Error';
    response.status(status).json({ code, data: null, message, date: null });
  }
}
