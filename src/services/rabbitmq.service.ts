import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { QUEUE_NAMES, EXCHANGE_NAMES } from '@/configs/rabbitmq.config';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * 发布消息到指定交换机
   * @param exchange 交换机名称
   * @param routingKey 路由键
   * @param message 消息内容
   */
  public async publishMessage(
    exchange: string,
    routingKey: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    try {
      if (!this.amqpConnection.connected) {
        this.logger.warn('RabbitMQ 未连接，跳过消息发布');
        return;
      }

      await this.amqpConnection.publish(exchange, routingKey, message);
      this.logger.log(`消息已发布到交换机 ${exchange}，路由键: ${routingKey}`);
    } catch (error) {
      this.logger.error(`发布消息失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 发布用户相关消息
   */
  public async publishUserMessage(
    routingKey: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    await this.publishMessage(EXCHANGE_NAMES.USER_EXCHANGE, routingKey, message);
  }

  /**
   * 发布通知消息
   */
  public async publishNotificationMessage(
    routingKey: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    await this.publishMessage(EXCHANGE_NAMES.NOTIFICATION_EXCHANGE, routingKey, message);
  }

  /**
   * 发布邮件消息
   */
  public async publishEmailMessage(
    routingKey: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    await this.publishMessage(EXCHANGE_NAMES.EMAIL_EXCHANGE, routingKey, message);
  }

  /**
   * 发布日志消息
   */
  public async publishLogMessage(
    routingKey: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    await this.publishMessage(EXCHANGE_NAMES.LOG_EXCHANGE, routingKey, message);
  }

  /**
   * 消费用户队列消息
   */
  @RabbitSubscribe({
    exchange: EXCHANGE_NAMES.USER_EXCHANGE,
    routingKey: 'user.*',
    queue: QUEUE_NAMES.USER_QUEUE,
  })
  public async handleUserMessage(message: Record<string, unknown>): Promise<void> {
    this.logger.log(`收到用户消息: ${JSON.stringify(message)}`);
    // 在这里处理用户相关的消息逻辑
  }

  /**
   * 消费通知队列消息
   */
  @RabbitSubscribe({
    exchange: EXCHANGE_NAMES.NOTIFICATION_EXCHANGE,
    routingKey: 'notification.*',
    queue: QUEUE_NAMES.NOTIFICATION_QUEUE,
  })
  public async handleNotificationMessage(message: Record<string, unknown>): Promise<void> {
    this.logger.log(`收到通知消息: ${JSON.stringify(message)}`);
    // 在这里处理通知相关的消息逻辑
  }

  /**
   * 消费邮件队列消息
   */
  @RabbitSubscribe({
    exchange: EXCHANGE_NAMES.EMAIL_EXCHANGE,
    routingKey: 'email.*',
    queue: QUEUE_NAMES.EMAIL_QUEUE,
  })
  public async handleEmailMessage(message: Record<string, unknown>): Promise<void> {
    this.logger.log(`收到邮件消息: ${JSON.stringify(message)}`);
    // 在这里处理邮件相关的消息逻辑
  }

  /**
   * 消费日志队列消息
   */
  @RabbitSubscribe({
    exchange: EXCHANGE_NAMES.LOG_EXCHANGE,
    routingKey: 'log.*',
    queue: QUEUE_NAMES.LOG_QUEUE,
  })
  public async handleLogMessage(message: Record<string, unknown>): Promise<void> {
    this.logger.log(`收到日志消息: ${JSON.stringify(message)}`);
    // 在这里处理日志相关的消息逻辑
  }

  /**
   * 获取连接状态
   */
  public async getConnectionStatus(): Promise<boolean> {
    try {
      // 检查连接是否可用
      if (!this.amqpConnection.connected) {
        return false;
      }

      // 直接返回连接状态，不进行测试发布
      return this.amqpConnection.connected;
    } catch (error) {
      this.logger.error(`RabbitMQ连接检查失败: ${error.message}`);
      return false;
    }
  }
}
