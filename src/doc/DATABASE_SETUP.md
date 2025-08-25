# 数据库配置与使用（MySQL + TypeORM）

项目使用 TypeORM 通过 `TypeOrmModule.forRoot(databaseConfig)` 全局配置 MySQL 连接。

## 环境变量

在 `.env` 中配置以下变量（Docker Compose 已为容器内设置对应值）：

```bash
# 应用
NODE_ENV=development
SERVICE_PORT=9000

# MySQL（与 src/configs/database.config.ts 对应）
NODE_MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=allinone_backend
```

Docker 场景下互通主机为 `mysql`，宿主机客户端连接使用 `127.0.0.1:3306`。

## 关键文件

- `src/configs/database.config.ts`：TypeORM 连接选项（实体自动加载、开发环境自动同步）
- `src/app.module.ts`：`TypeOrmModule.forRoot(databaseConfig)` 全局注册

主要选项：

- `entities: [__dirname + '/../**/*.entity{.ts,.js}']`
- `autoLoadEntities: true`
- `synchronize: process.env.NODE_ENV !== 'production'`

## 常用用法

方式一：Repository 注入（推荐）

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async list(): Promise<User[]> {
    return this.users.find();
  }
}
```

方式二：注入 `DataSource` 手动获取 Repository

```typescript
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '@/entity/user.entity';

@Injectable()
export class UserService {
  private readonly users: Repository<User>;
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.users = this.dataSource.getRepository(User);
  }
}
```

## 启动前准备

1. 启动 MySQL
2. 创建数据库：
   ```sql
   CREATE DATABASE allinone_backend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. 配置 `.env`
4. 启动应用：`pnpm dev`

## 注意事项

- 生产环境请关闭 `synchronize`，使用迁移
- 调整连接池 `extra.connectionLimit` 等参数以匹配负载
- 确保实体文件命名为 `*.entity.ts`
