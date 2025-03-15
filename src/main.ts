import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new BigIntSerializerInterceptor());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT') || 3000;

  app.enableCors();

  console.log(`Application is running on port: ${port}`);
  await app.listen(port);
}
bootstrap();