import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path'; // Importe join pour le chemin
import * as express from 'express'; // Importe express
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Swagger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurer ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configurer le dossier pour les téléchargements
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Configurer Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Description de votre API')
    .setVersion('1.0')
    .addBearerAuth() // Ajoute l'authentification par token si nécessaire
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Lancer l'application
  await app.listen(3000);
}
bootstrap();
