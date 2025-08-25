# RabbitMQ 安装和配置说明

## 🚨 当前状态

你的应用已经成功集成了 RabbitMQ，但是遇到了连接问题。这是因为 RabbitMQ 服务没有运行。

## 🔧 解决方案

### 方案 1: 安装 Docker Desktop (推荐)

1. **下载 Docker Desktop**
   - 访问 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - 下载适合你系统的版本 (macOS/Windows/Linux)

2. **安装并启动 Docker Desktop**

   ```bash
   # 安装完成后，启动 Docker Desktop
   # 等待 Docker 服务完全启动
   ```

3. **启动 RabbitMQ 服务**

   ```bash
   # 使用 Docker Compose 启动
   docker-compose up -d rabbitmq

   # 或者使用启动脚本
   ./start-rabbitmq.sh
   ```

4. **验证 RabbitMQ 状态**

   ```bash
   # 检查容器状态
   docker ps | grep rabbitmq

   # 检查端口是否开放
   lsof -i :5672
   ```

### 方案 2: 使用 Homebrew 安装 (macOS)

1. **安装 RabbitMQ**

   ```bash
   brew install rabbitmq
   ```

2. **启动 RabbitMQ 服务**

   ```bash
   # 启动服务
   brew services start rabbitmq

   # 或者手动启动
   /usr/local/sbin/rabbitmq-server
   ```

3. **安装管理插件**
   ```bash
   rabbitmq-plugins enable rabbitmq_management
   ```

### 方案 3: 使用包管理器安装 (Linux)

1. **Ubuntu/Debian**

   ```bash
   sudo apt update
   sudo apt install rabbitmq-server
   sudo systemctl start rabbitmq-server
   sudo systemctl enable rabbitmq-server
   ```

2. **CentOS/RHEL**
   ```bash
   sudo yum install rabbitmq-server
   sudo systemctl start rabbitmq-server
   sudo systemctl enable rabbitmq-server
   ```

## 🌐 访问地址

安装完成后，你可以通过以下地址访问：

- **RabbitMQ 管理界面**: http://localhost:15672
  - 用户名: `guest`
  - 密码: `guest`

- **AMQP 端口**: 5672

## 🧪 测试连接

1. **启动你的应用**

   ```bash
   pnpm dev
   ```

2. **测试 RabbitMQ 状态**

   ```bash
   curl http://localhost:9000/rabbitmq/test/status | cat
   ```

3. **发送测试消息**
   ```bash
   curl -X POST http://localhost:9000/rabbitmq/test/user -H 'Content-Type: application/json' -d '{"message":"Hello RabbitMQ!"}' | cat
   ```

## 🔍 故障排除

### 问题 1: 端口被占用

```bash
# 检查端口占用
lsof -i :5672
lsof -i :15672

# 如果被占用，找到进程并停止
kill -9 <PID>
```

### 问题 2: 权限问题

```bash
# 确保有足够权限
sudo chown -R $USER:$USER /var/lib/rabbitmq
sudo chown -R $USER:$USER /var/log/rabbitmq
```

### 问题 3: 防火墙问题

```bash
# 开放端口 (Ubuntu/Debian)
sudo ufw allow 5672
sudo ufw allow 15672

# 开放端口 (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=5672/tcp
sudo firewall-cmd --permanent --add-port=15672/tcp
sudo firewall-cmd --reload
```

## 📊 监控和日志

### 查看 RabbitMQ 日志

```bash
# Docker 方式
docker logs rabbitmq

# 系统安装方式
sudo tail -f /var/log/rabbitmq/rabbit@hostname.log
```

### 查看应用日志

```bash
# 查看应用启动日志
pnpm run dev | grep -i rabbitmq
```

## 🎯 下一步

1. **选择并执行安装方案**
2. **启动 RabbitMQ 服务**
3. **重启你的应用**
4. **测试消息发送和接收**
5. **集成到业务逻辑中**

## 💡 提示

- 如果你暂时不需要 RabbitMQ 功能，应用仍然可以正常运行
- 所有 RabbitMQ 相关的 API 都会优雅地处理连接失败的情况
- 建议在生产环境中使用 Docker 或云服务来管理 RabbitMQ

---

🎉 **安装完成后，你的应用就能完全使用 RabbitMQ 功能了！**
