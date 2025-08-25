# 项目文档总览

本项目是基于 NestJS 11 的后端服务，集成了 MySQL(TypeORM)、Redis(ioredis) 与 RabbitMQ(@golevelup/nestjs-rabbitmq)，并通过 Docker Compose 提供一键启动的本地开发环境。

## 目录结构（关键部分）

```
src/
├── app.module.ts
├── main.ts
├── auth/
├── configs/
│   ├── database.config.ts
│   ├── env.config.ts
│   ├── rabbitmq.config.ts
│   └── redis/
│       ├── index.ts
│       ├── redis.controller.ts
│       ├── redis.interface.ts
│       ├── redis.module.ts
│       └── redis.service.ts
├── controller/
│   └── rabbitmq.controller.ts
├── modules/
│   └── rabbitmq.module.ts
├── services/
│   └── rabbitmq.service.ts
└── entity/
    ├── user.entity.ts
    └── menu.entity.ts
```

## 快速开始

1. 安装依赖：`pnpm install`（或 npm/yarn）
2. 配置环境变量：复制 `.env.example` 为 `.env`（见下文）
3. 本地开发：`pnpm dev`（默认启用 Swagger：`/api`）
4. Docker 启动（包含 MySQL/Redis/RabbitMQ）：`docker compose up -d`

## 环境变量

应用与数据库等配置通过环境变量读取：

```bash
# App
NODE_ENV=development
SERVICE_PORT=9000

# MySQL (与 TypeORM 对应)
NODE_MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=allinone_backend

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
```

Docker Compose 场景下，服务间互通主机名为容器名，例如 `mysql`、`redis`、`rabbitmq`；应用容器会自动读取这些值。

## 数据库（MySQL / TypeORM）

- 全局 `TypeOrmModule.forRoot(databaseConfig)` 配置于 `src/app.module.ts`
- 配置项见 `src/configs/database.config.ts`（实体自动加载、开发环境自动同步）

## Redis

- 模块位置：`src/configs/redis/*`
- 控制器路由前缀：`/redis`
- 主要接口：
  - `GET /redis/health`
  - `GET /redis/status`
  - `GET /redis/info`
  - `GET /redis/memory`
  - `POST /redis/test`
  - `GET /redis/keys/:pattern`
  - `DELETE /redis/keys/:key`

在服务中注入：

```typescript
import { Inject, Injectable } from '@nestjs/common';
import type { IRedisService } from '@/configs/redis';

@Injectable()
export class DemoService {
  constructor(@Inject('IRedisService') private readonly redis: IRedisService) {}
}
```

## RabbitMQ

- 模块：`src/modules/rabbitmq.module.ts`
- 控制器：`src/controller/rabbitmq.controller.ts`（路由前缀 `/rabbitmq`）
- 服务：`src/services/rabbitmq.service.ts`
- 主要测试接口：
  - `GET /rabbitmq/test/status`
  - `POST /rabbitmq/test/user`
  - `POST /rabbitmq/test/notification`
  - `POST /rabbitmq/test/email`
  - `POST /rabbitmq/test/log`

## Swagger

开发环境自动开启，访问路径：`/api`

## 运行端口

- 由 `SERVICE_PORT` 决定（默认 9000 于 Docker，单机运行时 main.ts 回退到 3000）

## 常见问题

- 确认依赖服务启动：MySQL、Redis、RabbitMQ
- 端口冲突：检查 `SERVICE_PORT`/`3306`/`6379`/`5672`/`15672`
- Docker 场景下，应用访问数据库请使用容器名主机 `mysql`，宿主机客户端访问使用 `127.0.0.1`
