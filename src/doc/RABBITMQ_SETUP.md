# RabbitMQ 集成说明

## 概述

本项目已成功集成 `@golevelup/nestjs-rabbitmq` 插件，提供了完整的消息队列功能。

## 功能特性

- ✅ 自动创建交换机和队列
- ✅ 支持多种消息类型（用户、通知、邮件、日志）
- ✅ 消息持久化
- ✅ 自动重连机制
- ✅ 健康检查接口
- ✅ 测试消息发送接口

## 环境变量配置

在 `.env` 文件中添加以下配置：

```bash
# RabbitMQ配置
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_QUEUE=default_queue
```

## Docker 启动

使用 Docker Compose 启动包含 RabbitMQ 的完整环境：

```bash
docker-compose up -d
```

这将启动：

- 你的应用服务
- RabbitMQ 服务（端口 5672）
- RabbitMQ 管理界面（端口 15672）

## API 接口

### 1. 检查连接状态

```
GET /rabbitmq/status
```

### 2. 发送测试消息

```
POST /rabbitmq/test/user
POST /rabbitmq/test/notification
POST /rabbitmq/test/email
POST /rabbitmq/test/log
```

请求体示例：

```json
{
  "message": "测试消息内容"
}
```

## 队列结构

### 交换机 (Exchanges)

- `user_exchange` - 用户相关消息
- `notification_exchange` - 通知相关消息
- `email_exchange` - 邮件相关消息
- `log_exchange` - 日志相关消息

### 队列 (Queues)

- `user_queue` - 用户消息队列
- `notification_queue` - 通知消息队列
- `email_queue` - 邮件消息队列
- `log_queue` - 日志消息队列

### 路由键 (Routing Keys)

- `user.*` - 用户相关消息
- `notification.*` - 通知相关消息
- `email.*` - 邮件相关消息
- `log.*` - 日志相关消息

## 使用方法

### 在服务中注入 RabbitMQService

```typescript
import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '@/modules/rabbitmq/rabbitmq.service';

@Injectable()
export class YourService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendUserMessage() {
    await this.rabbitMQService.publishUserMessage('user.created', {
      userId: 123,
      action: 'created',
    });
  }
}
```

### 自定义消息处理器

```typescript
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@RabbitSubscribe({
  exchange: 'user_exchange',
  routingKey: 'user.created',
  queue: 'custom_user_queue',
})
async handleUserCreated(message: any) {
  console.log('用户创建消息:', message);
  // 处理消息逻辑
}
```

## 监控和管理

访问 RabbitMQ 管理界面：

- URL: http://localhost:15672
- 用户名: guest
- 密码: guest

在管理界面中可以：

- 查看队列状态
- 监控消息流量
- 管理交换机和绑定
- 查看连接状态

## 故障排除

### 连接失败

1. 检查 RabbitMQ 服务是否启动
2. 验证环境变量配置
3. 检查网络连接

### 消息丢失

1. 确保队列设置为持久化
2. 检查消息确认机制
3. 验证交换机类型和绑定

## 最佳实践

1. **消息持久化**: 所有队列都设置为持久化，确保消息不丢失
2. **错误处理**: 在消息处理器中添加适当的错误处理逻辑
3. **监控**: 定期检查队列长度和消息处理状态
4. **测试**: 使用提供的测试接口验证消息发送和接收
