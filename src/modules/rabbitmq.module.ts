import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { rabbitmqConfig } from '@/configs/rabbitmq.config';
import { RabbitMQService } from '@/services/rabbitmq.service';
import { RabbitMQController } from '@/controller/rabbitmq.controller';

@Module({
  imports: [RabbitMQModule.forRoot(rabbitmqConfig)],
  providers: [RabbitMQService],
  controllers: [RabbitMQController],
  exports: [RabbitMQService],
})
export class RabbitMQAppModule {}
