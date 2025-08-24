import { Module } from '@nestjs/common';
import { DtoTransformInterceptor } from './interceptors/dto-transform.interceptor';
import { GlobalResponseWrapperInterceptor } from '@/interceptors/global-response.interceptor';
import { HttpExceptionFilter } from '@/interceptors/http-exception.filter';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { UserModule } from '@/modules/user.modules';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: GlobalResponseWrapperInterceptor },
    { provide: APP_INTERCEPTOR, useClass: DtoTransformInterceptor },
    { provide: 'DEFAULT_DTO', useValue: null },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: 'DEFAULT_SUCCESS_CODE', useValue: 0 },
    { provide: 'DEFAULT_ERROR_CODE', useValue: 9000 },
  ],
})
export class AppModule {}
