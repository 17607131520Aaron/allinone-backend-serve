#!/bin/bash

echo "🚀 启动RabbitMQ服务..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 启动RabbitMQ服务
echo "📦 启动RabbitMQ容器..."
docker-compose up -d rabbitmq

# 等待RabbitMQ启动
echo "⏳ 等待RabbitMQ服务启动..."
sleep 10

# 检查RabbitMQ状态
if docker-compose ps rabbitmq | grep -q "Up"; then
    echo "✅ RabbitMQ服务启动成功！"
    echo "🌐 AMQP端口: 5672"
    echo "🔧 管理界面: http://localhost:15672"
    echo "👤 用户名: guest"
    echo "🔐 密码: guest"
else
    echo "❌ RabbitMQ服务启动失败"
    docker-compose logs rabbitmq
    exit 1
fi

echo ""
echo "🎯 现在可以启动你的应用了："
echo "   pnpm run dev"
