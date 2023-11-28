import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccountingInterceptor } from './accounting/accounting.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: configure proxy
  app.enableCors();
  app.useGlobalInterceptors(new AccountingInterceptor());
  await app.listen(3000);
}
bootstrap();
