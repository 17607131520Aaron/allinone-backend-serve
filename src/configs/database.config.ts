import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

// 数据库配置
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456789',
  database: process.env.DB_DATABASE || 'allinone-backend-test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // 非生产环境自动同步表结构
  logging: false, // 关闭SQL日志输出
  autoLoadEntities: true, // 自动加载实体
  charset: 'utf8mb4', // 支持emoji等特殊字符
  timezone: '+08:00', // 设置时区为东八区
  // 连接池配置
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
  // 重试配置
  retryAttempts: 3, // 重试次数
  retryDelay: 3000, // 重试延迟
};
