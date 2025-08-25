# RabbitMQ 集成与测试

项目通过 `@golevelup/nestjs-rabbitmq` 集成 RabbitMQ，模块、控制器与服务如下：

- 模块：`src/modules/rabbitmq.module.ts`
- 控制器：`src/controller/rabbitmq.controller.ts`（前缀 `/rabbitmq`）
- 服务：`src/services/rabbitmq.service.ts`

## 环境变量

```bash
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
```

Docker Compose 中应用容器会使用 `rabbitmq` 作为主机名。

## 可用接口（用于连通性与测试）

- `GET /rabbitmq/test/status`
- `POST /rabbitmq/test/user`
- `POST /rabbitmq/test/notification`
- `POST /rabbitmq/test/email`
- `POST /rabbitmq/test/log`

请求体示例：

```json
{ "message": "测试消息内容" }
```

## 消息发布快捷方法

服务中可直接调用：

```typescript
await rabbitMQService.publishUserMessage('user.created', payload);
await rabbitMQService.publishNotificationMessage('notification.sent', payload);
await rabbitMQService.publishEmailMessage('email.sent', payload);
await rabbitMQService.publishLogMessage('log.created', payload);
```

## 管理界面

- 访问管理 UI：`http://localhost:15672`
- 默认用户名/密码：`guest/guest`

## 常见问题

- 未连接：确认 RabbitMQ 服务已启动，端口与凭据正确
- 消息未到达：检查交换机/队列/路由键绑定配置
