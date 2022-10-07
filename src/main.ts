import * as cookieParser from 'cookie-parser';

import { AppModule } from './modules/app/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(process.env.APP_SECRET));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(process.env.API_PREFIX || '');

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
