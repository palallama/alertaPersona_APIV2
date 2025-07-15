import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/api")
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }),
  );

  // Configuración del ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('environment.port') || 3000;

  // Configuración de Prisma
  const prismaService = app.get(PrismaService);
  
  // Configuración global de CORS
  app.enableCors({
    origin: '*', //configService.get('CORS_ORIGIN') || 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  
  const config = new DocumentBuilder()
    .setTitle('Alerta Persona')
    .setDescription('Documentación de la API de Alerta Persona')
    .setVersion('0.1')
    .addTag('Auth')
    .addTag('Usuario')
    .addTag('Alerta')
    .addTag('Asistente')
    .addTag('Usuario Adicional')
    .addTag('Notificaciones')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentacion', app, document); // accede en /api
  
  // Inicia la aplicación
  await app.listen(port);

  console.log(`Aplicacion iniciada en el puerto: ${port}`);
}
bootstrap();
