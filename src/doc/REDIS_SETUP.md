# Redis 模块与接口

模块位于 `src/configs/redis/`，基于 ioredis 实现连接与健康检查，提供管理与读写接口。

## 环境变量

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

Docker Compose 中应用容器会使用 `redis` 作为主机名。

## 关键文件

- `src/configs/redis/redis.module.ts`
- `src/configs/redis/redis.service.ts`
- `src/configs/redis/redis.controller.ts`
- `src/configs/redis.config.ts`（连接与健康检查配置、常量）

## 提供的接口（Controller 前缀 `/redis`）

- `GET /redis/health`
- `GET /redis/status`
- `GET /redis/info`
- `GET /redis/memory`
- `POST /redis/test`（body: `{ key, value, ttl? }`）
- `GET /redis/keys/:pattern`
- `DELETE /redis/keys/:key`

## 在服务中使用

```typescript
import { Inject, Injectable } from '@nestjs/common';
import type { IRedisService } from '@/configs/redis';

@Injectable()
export class DemoService {
  constructor(@Inject('IRedisService') private readonly redis: IRedisService) {}
}
```

## 常见问题

- 连接失败：确认 Redis 已启动，端口与密码正确
- 健康检查失败：查看应用日志，检查网络连通与 REDIS\_\* 配置
- 生产安全：设置密码并限制网络范围
