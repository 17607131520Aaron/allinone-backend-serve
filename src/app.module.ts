import { Module } from '@nestjs/common';
import { DtoTransformInterceptor } from './interceptors/dto-transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './modules/user.modules';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: DtoTransformInterceptor },
    { provide: 'DEFAULT_DTO', useValue: null },
  ],
})
export class AppModule {}
