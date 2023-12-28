import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SERVER_PORT } from './commom/constants/env-variables';

async function bootstrap () {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const configService = app.get(ConfigService)
  const port = +configService.get(SERVER_PORT) || 9000

  app.enableCors({ origin: 'localhost:9000' })

  await app.listen(port)
}
bootstrap();
