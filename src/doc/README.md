# Redis 模块

## 模块结构

```
src/modules/redis/
├── README.md              # 模块说明文档
├── index.ts               # 模块导出文件
├── redis.module.ts        # Redis模块定义
├── redis.interface.ts     # Redis服务接口
├── redis.service.ts       # Redis服务实现
├── redis.controller.ts    # Redis控制器
└── redis.utils.ts         # Redis工具类
```

## 功能特性

### 1. 自动连接管理

- 应用启动时自动连接Redis
- 连接失败时自动重试
- 支持连接池和重连机制
- 实时健康检查

### 2. 完整的Redis操作API

- 基础操作：set, get, del, exists, expire, ttl
- 哈希操作：hset, hget, hdel, hgetall
- 列表操作：lpush, rpush, lpop, rpop, lrange
- 集合操作：sadd, srem, smembers, sismember
- 有序集合：zadd, zrem, zrange, zscore

### 3. 监控和管理

- 连接状态监控
- 健康检查API
- 内存使用统计
- 键管理和查询

### 4. 工具类支持

- 键名生成和管理
- 过期时间管理
- 批量操作支持
- 命名空间管理

## 使用方法

### 在其他模块中注入Redis服务

```typescript
import { Injectable } from '@nestjs/common';
import { IRedisService } from '@/modules/redis';

@Injectable()
export class YourService {
  constructor(
    @Inject('IRedisService')
    private readonly redisService: IRedisService,
  ) {}

  async someMethod() {
    // 使用Redis服务
    await this.redisService.set('key', 'value', 3600);
    const value = await this.redisService.get('key');
  }
}
```

### 使用Redis工具类

```typescript
import { RedisUtils, REDIS_CONSTANTS } from '@/modules/redis';

// 生成用户缓存键
const userCacheKey = RedisUtils.getUserCacheKey('123');

// 生成带过期时间的缓存键
const { key, ttl } = RedisUtils.getExpiringCacheKey('product', '456');

// 获取默认过期时间
const sessionTTL = RedisUtils.getDefaultTTL('SESSION');
```

### 使用Redis常量

```typescript
import { REDIS_CONSTANTS } from '@/modules/redis';

// 使用键前缀
const userKey = `${REDIS_CONSTANTS.KEY_PREFIXES.USER}123`;

// 使用默认过期时间
const cacheTTL = REDIS_CONSTANTS.DEFAULT_TTL.CACHE;

// 使用连接状态
if (status === REDIS_CONSTANTS.STATUS.READY) {
  // Redis已就绪
}
```

## API接口

### 健康检查

- `GET /redis/health` - 检查Redis连接状态

### 状态监控

- `GET /redis/status` - 获取连接状态和统计信息
- `GET /redis/info` - 获取Redis服务器信息
- `GET /redis/memory` - 获取内存使用情况

### 操作测试

- `POST /redis/test` - 测试Redis读写操作

### 键管理

- `GET /redis/keys/:pattern` - 查询Redis键
- `DELETE /redis/keys/:key` - 删除指定键

## 配置说明

### 环境变量

```bash
# Redis配置
REDIS_HOST=localhost          # Redis服务器地址
REDIS_PORT=6379              # Redis端口
REDIS_PASSWORD=               # Redis密码（如果有）
REDIS_DB=0                   # Redis数据库编号
```

### 连接配置

- `retryDelayOnFailover`: 故障转移重试延迟
- `maxRetriesPerRequest`: 每个请求最大重试次数
- `lazyConnect`: 延迟连接
- `keepAlive`: 保持连接时间
- `connectTimeout`: 连接超时时间
- `commandTimeout`: 命令超时时间

### 健康检查配置

- `checkInterval`: 检查间隔（30秒）
- `timeout`: 超时时间（5秒）
- `maxRetries`: 最大重试次数（3次）

## 最佳实践

### 1. 键命名规范

- 使用冒号分隔命名空间：`user:123:profile`
- 使用工具类生成键名，避免硬编码
- 合理设置过期时间，避免内存泄漏

### 2. 错误处理

- 所有Redis操作都应该有适当的错误处理
- 使用try-catch包装Redis操作
- 记录错误日志便于调试

### 3. 性能优化

- 使用管道（pipeline）进行批量操作
- 合理设置连接池大小
- 监控内存使用情况

### 4. 安全考虑

- 在生产环境中设置Redis密码
- 限制Redis访问网络范围
- 定期备份重要数据

## 故障排除

### 连接失败

1. 检查Redis服务是否运行
2. 验证环境变量配置
3. 检查网络连接和防火墙设置
4. 查看应用日志中的错误信息

### 性能问题

1. 检查Redis内存使用情况
2. 监控连接池状态
3. 优化Redis配置参数
4. 使用Redis慢查询日志分析性能瓶颈

### 内存泄漏

1. 检查键的过期时间设置
2. 监控内存使用趋势
3. 定期清理无用的键
4. 使用Redis内存分析工具
