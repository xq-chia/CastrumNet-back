import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: configure proxy
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
