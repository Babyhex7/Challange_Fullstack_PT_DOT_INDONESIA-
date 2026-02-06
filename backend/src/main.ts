// Entry point aplikasi NestJS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan CORS agar frontend bisa akses API
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // Set prefix global /api/v1
  app.setGlobalPrefix('api/v1');

  // Validasi input otomatis (DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // buang field yang tidak ada di DTO
      forbidNonWhitelisted: true, // error kalau ada field asing
      transform: true, // auto transform tipe data
      exceptionFactory: (errors) => {
        const details = errors.map((err) => ({
          field: err.property,
          message: Object.values(err.constraints || {})[0],
        }));
        return new BadRequestException({
          message: 'Validation failed',
          details,
        });
      },
    }),
  );

  // Global exception filter (format error response)
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptor (format success response)
  app.useGlobalInterceptors(new TransformInterceptor());

  // Setup Swagger dokumentasi API
  const config = new DocumentBuilder()
    .setTitle('Admin Panel API')
    .setDescription('API untuk Admin Panel Management System')
    .setVersion('1.0')
    .addBearerAuth() // tambah auth di Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // akses di /api/docs

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Swagger docs di http://localhost:${port}/api/docs`);
}
bootstrap();
