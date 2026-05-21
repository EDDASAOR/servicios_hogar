import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Orígenes permitidos: incluye producción en Vercel + localhost para desarrollo
  const allowedOrigins: (string | RegExp)[] = [
    'https://servicios-hogar.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
    // Botpress Cloud
    'https://cdn.botpress.cloud',
    'https://mediafiles.botpress.cloud',
    /\.botpress\.cloud$/,
  ];

  // Si hay FRONTEND_URL en las variables de entorno, agregarla también
  if (process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL.split(',').forEach((url) => {
      const trimmed = url.trim();
      if (trimmed && !allowedOrigins.includes(trimmed)) {
        allowedOrigins.push(trimmed);
      }
    });
  }

  app.enableCors({
    origin: true, // Permitir TODO temporalmente para debuggear
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Railway requiere escuchar en 0.0.0.0
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 HogarPro API corriendo en puerto: ${port}`);
  console.log(`🗄️  Base de datos: MongoDB Atlas`);
}
bootstrap();
