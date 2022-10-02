import { AppModule } from './modules/app/app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(process.env.API_PREFIX || '');

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
