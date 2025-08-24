import { Module } from '@nestjs/common';
import { DtoTransformInterceptor } from './interceptors/dto-transform.interceptor';
import { GlobalResponseWrapperInterceptor } from '@/interceptors/global-response.interceptor';
import { HttpExceptionFilter } from '@/interceptors/http-exception.interceptor';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { UserModule } from '@/modules/user.modules';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule],
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
