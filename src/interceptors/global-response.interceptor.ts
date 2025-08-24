import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalResponseWrapperInterceptor implements NestInterceptor {
  constructor(@Inject('DEFAULT_SUCCESS_CODE') private readonly defaultSuccessCode: number) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (
          data &&
          typeof data === 'object' &&
          (data as Record<string, unknown>).code !== undefined &&
          (data as Record<string, unknown>).data !== undefined
        ) {
          // Already wrapped by another layer
          return data;
        }
        const payload = typeof data === 'undefined' ? true : data;
        return {
          code: this.defaultSuccessCode ?? 0,
          data: payload,
          message: 'success',
        };
      }),
    );
  }
}
