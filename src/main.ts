import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown fields
      forbidNonWhitelisted: true, // Reject requests with unknown fields
      transform: true, // Transform payload to DTO instance
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('NestJS Zero to Hero - RESTful API with Validation & Docs')
    .setVersion('1.0')
    .addTag('tasks', 'Endpoints related to task management')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
