import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Optional,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import type { ClassConstructor } from 'class-transformer';

type DataDict = Record<string, unknown>;

@Injectable()
export class DtoTransformInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Optional() @Inject('DEFAULT_DTO') private readonly defaultDto?: ClassConstructor<object>,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Record<string, unknown>> {
    const dto = this.reflector.get<ClassConstructor<object>>('dto', context.getHandler());
    if (dto) {
      const dtoClass: ClassConstructor<object> = dto as ClassConstructor<object>;
      const source$ = next.handle() as Observable<DataDict>;
      return source$.pipe(
        map((data: DataDict) => {
          const inst = plainToInstance(dtoClass, data, { excludeExtraneousValues: true });
          return inst as unknown as Record<string, unknown>;
        }),
      );
    }
    if (this.defaultDto) {
      const defaultClass: ClassConstructor<object> = this.defaultDto as ClassConstructor<object>;
      const source$ = next.handle() as Observable<DataDict>;
      return source$.pipe(
        map((data: DataDict) => {
          const inst = plainToInstance(defaultClass, data, { excludeExtraneousValues: true });
          return inst as unknown as Record<string, unknown>;
        }),
      );
    }
    return next.handle();
  }
}
