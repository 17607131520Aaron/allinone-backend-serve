import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

function getPortFromConfig(cfg: string | number | undefined, fallback = 3000): number {
  const v = Number(cfg);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}
function getEnvFromConfig(cfg: string | undefined): string {
  return (cfg ?? 'development').toString().trim();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const env = getEnvFromConfig(config.get<string>('NODE_ENV'));

  if (env !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API 文档')
      .setDescription('API 描述')
      .setVersion('1.0')
      .addTag('api')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const port = getPortFromConfig(config.get<string>('SERVICE_PORT'), 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}  (env=${env})`);
}
void bootstrap();
