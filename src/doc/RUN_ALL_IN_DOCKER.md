## 使用 Docker Compose 启动应用 + MySQL + Redis + RabbitMQ

本指南说明如何使用 `docker compose` 启动整套服务，并确保应用正确连接容器内 MySQL/Redis/RabbitMQ。

### 1. 前置条件

- 已安装 Docker 和 Docker Compose
- 可用的命令行终端

### 2. 启动全部容器

在项目根目录执行：

```bash
cd /Users/alone/my-front-project/allinone-backend-serve

# 可按需覆盖镜像名和服务端口（可不设，使用默认值）
export IMAGE_NAME=allinone-backend-serve:local
export SERVICE_PORT=9000

docker compose build
docker compose up -d
```

Compose 会启动以下服务：

- app（Nest 应用）
- mysql（MySQL 8.0）
- redis（Redis 7）
- rabbitmq（带管理界面）

### 3. 应用到 MySQL/Redis/RabbitMQ 的连接（容器内互通）

`docker-compose.yml` 已为 `app` 注入环境变量，代码读取如下：

- MySQL（`src/configs/database.config.ts`）：
  - host: `mysql`
  - port: `3306`
  - username: `root`
  - password: `example`
  - database: `allinone_backend`

- Redis（`src/configs/redis.config.ts`）：
  - host: `redis`
  - port: `6379`
  - db: `0`

- RabbitMQ（`src/configs/rabbitmq.config.ts`）：
  - host: `rabbitmq`
  - port: `5672`

应用在非 `production` 环境下会自动同步实体到数据库（`synchronize: true`），首次启动会自动建表。

### 4. 验证服务是否启动成功

- 查看容器状态：

```bash
docker compose ps
```

- 查看应用日志：

```bash
docker logs -f app | cat
```

- 等待 MySQL 健康检查通过（已配置 healthcheck）。也可手动测试：

````bash
docker exec -it mysql mysql -uroot -pexample -e "SHOW DATABASES;"

- 验证 Redis：

```bash
docker exec -it redis redis-cli PING | cat
````

- 验证 RabbitMQ：

```bash
curl http://localhost:15672 | cat
```

````

### 5. 从宿主机访问 MySQL（可选）

Compose 已将 MySQL 映射到宿主机端口（默认 `3306`）。可以直接在本机连接：

```bash
mysql -h127.0.0.1 -P3306 -uroot -pexample -e "SHOW DATABASES;"
````

或在图形化客户端中使用：

- Host: 127.0.0.1
- Port: 3306
- User: root
- Password: example
- Database: allinone_backend

注意：应用容器内访问数据库请使用主机名 `mysql`，宿主机访问使用 `127.0.0.1`。

### 6. 常见问题排查

- 连接超时/拒绝：
  - 确认 `mysql` 容器健康检查通过：`docker inspect mysql --format='{{json .State.Health}}' | jq`。
  - 先启动数据库：`docker compose up -d mysql`，待就绪后再启动 `app`。
- 自动建表未生效：
  - 确认 `NODE_ENV` 不是 `production`（生产环境默认不同步表结构）。
  - 检查实体是否被 TypeORM 正确加载（`entities` 路径、`autoLoadEntities` 设置）。
- 宿主机无法连接容器内 MySQL：
  - 确认端口已映射（`docker compose ps` 查看 `0.0.0.0:3306->3306/tcp`）。
  - 本机连接请使用 `127.0.0.1:3306`，不要使用 `mysql` 主机名。
- RabbitMQ 未连接：确认 5672/15672 端口可达；应用内测试 `GET /rabbitmq/test/status`
- Redis 未连接：确认 6379 端口可达；应用内测试 `GET /redis/health`

### 7. 管理与维护

- 停止服务：

```bash
docker compose down
```

- 后台重启单个服务：

```bash
docker compose restart app
docker compose restart mysql
docker compose restart redis
docker compose restart rabbitmq
```

- 查看单个容器日志：

```bash
docker logs -f mysql | cat
docker logs -f redis | cat
docker logs -f rabbitmq | cat
docker logs -f app | cat
```

- 清空所有数据（谨慎）：

```bash
docker compose down -v
```

这会删除包括 `mysql_data`、`redis_data`、`rabbitmq_data`、`rabbitmq_logs` 的持久化卷。

### 8. 连接字符串示例（可选参考）

如果需要在其它工具或语言中使用连接字符串：

- MySQL DSN: `mysql://root:example@mysql:3306/allinone_backend`
- TypeORM（Node.js）示例参数已在 `src/configs/database.config.ts` 配置为从环境变量读取。

### 9. 账号与安全

本地开发默认使用 root/example。若需生产环境：

- 修改 `docker-compose.yml` 中 MySQL 初始密码
- 创建业务账户并授予最小权限
- 关闭自动建表，改为使用迁移

---

如需将这些步骤合并为脚本、添加数据库初始化 SQL 或编写迁移，请告知我以便补充。
