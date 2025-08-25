import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DtoTransformInterceptor } from './interceptors/dto-transform.interceptor';
import { GlobalResponseWrapperInterceptor } from '@/interceptors/global-response.interceptor';
import { HttpExceptionFilter } from '@/interceptors/http-exception.interceptor';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { UserModule } from '@/modules/user.modules';
import { RedisModule } from '@/configs/redis';
import { databaseConfig } from '@/configs/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      load: [
        () => {
          const env = process.env.NODE_ENV || 'development';
          console.log(`[ConfigModule] Loading environment: ${env}`);
          console.log(`[ConfigModule] Looking for files: .env.${env}, .env`);
          return {};
        },
      ],
    }),
    TypeOrmModule.forRoot(databaseConfig), // 全局配置数据库连接
    RedisModule, // Redis模块
    UserModule,
  ],
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
export class AppModule implements OnModuleInit {
  public onModuleInit(): void {
    console.log('\n✅ MySQL数据库连接成功！');
    console.log(`📊 数据库: ${process.env.MYSQL_DATABASE}`);
    console.log(`🌐 连接地址: ${process.env.NODE_MYSQL_HOST}:${process.env.MYSQL_PORT}`);
    console.log(`👤 用户名: ${process.env.MYSQL_USERNAME}`);
    console.log(`🔐 端口: ${process.env.MYSQL_PORT}`);
    console.log('========================\n');

    console.log('✅ Redis模块已加载！');
    console.log(
      `🌐 Redis地址: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    );
    console.log(`🗄️ Redis数据库: ${process.env.REDIS_DB || '0'}`);
    console.log('========================\n');
  }
}
