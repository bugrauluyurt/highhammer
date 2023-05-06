/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log({
    NX_POSTGRES_HOST: process.env.NX_POSTGRES_HOST,
    NX_POSTGRES_PORT: process.env.NX_POSTGRES_PORT,
    NX_POSTGRES_USER: process.env.NX_POSTGRES_USER,
    NX_POSTGRES_DB: process.env.NX_POSTGRES_DB
  })
}

bootstrap();
