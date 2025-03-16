import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new BigIntSerializerInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Test Thera NodeJS')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte a JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT') || 3000;

  app.enableCors();

  console.log(`Application is running on port: ${port}`);
  await app.listen(port);
}
void bootstrap();
