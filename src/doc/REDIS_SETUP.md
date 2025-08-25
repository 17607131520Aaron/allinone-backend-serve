# Redis 配置说明

## 环境变量配置

在 `.env` 文件中添加以下Redis配置：

```bash
# Redis配置
REDIS_HOST=localhost          # Redis服务器地址
REDIS_PORT=6379              # Redis端口
REDIS_PASSWORD=               # Redis密码（如果有）
REDIS_DB=0                   # Redis数据库编号
```

## 功能特性

### 1. 自动连接管理

- 应用启动时自动连接Redis
- 连接失败时自动重试
- 支持连接池和重连机制

### 2. 健康检查

- 定期检查Redis连接状态
- 实时监控连接健康状态
- 自动重连机制

### 3. 完整的Redis操作API

- 基础操作：set, get, del, exists, expire, ttl
- 哈希操作：hset, hget, hdel, hgetall
- 列表操作：lpush, rpush, lpop, rpop, lrange
- 集合操作：sadd, srem, smembers, sismember
- 有序集合：zadd, zrem, zrange, zscore

### 4. 监控接口

#### 健康检查

```bash
GET /redis/health
```

#### 连接状态

```bash
GET /redis/status
```

#### Redis信息

```bash
GET /redis/info
```

#### 测试Redis操作

```bash
POST /redis/test
{
  "key": "test_key",
  "value": "test_value",
  "ttl": 3600
}
```

#### 查询键

```bash
GET /redis/keys/*
```

#### 删除键

```bash
DELETE /redis/keys/test_key
```

#### 内存使用情况

```bash
GET /redis/memory
```

## 使用方法

### 在其他服务中注入Redis服务

```typescript
import { Injectable } from '@nestjs/common';
import { IRedisService } from '@/services/interfaces/redis.interface';

@Injectable()
export class YourService {
  constructor(private readonly redisService: IRedisService) {}

  async someMethod() {
    // 设置缓存
    await this.redisService.set('key', 'value', 3600);

    // 获取缓存
    const value = await this.redisService.get('key');

    // 检查键是否存在
    const exists = await this.redisService.exists('key');
  }
}
```

## 注意事项

1. Redis服务已设置为全局模块，无需在其他模块中导入
2. 支持自动重连和健康检查
3. 所有Redis操作都是异步的
4. 建议在生产环境中设置Redis密码
5. 可以通过环境变量调整连接超时和重试配置

## 故障排除

### 连接失败

1. 检查Redis服务是否运行
2. 验证环境变量配置
3. 检查网络连接和防火墙设置

### 性能问题

1. 检查Redis内存使用情况
2. 监控连接池状态
3. 优化Redis配置参数
