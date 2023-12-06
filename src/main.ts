import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path'; // Importa la función 'join' de Node.js para trabajar con rutas
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configurar Axios para usar body-parser
  const cors = require('cors');
  app.use(bodyParser.json());
  app.use(cors({
    origin: '*',
    credentials: true,
  }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/images', express.static(join(__dirname, '..', 'images')));
  app.use('/videos', express.static(join(__dirname, '..', 'videos')));
  app.use('/voices', express.static(join(__dirname, '..', 'voices')));
  app.use('/content', express.static(join(__dirname, '..', 'content')));

  await app.listen(process.env.PORT || 3001);
}
bootstrap(); //asdasd
