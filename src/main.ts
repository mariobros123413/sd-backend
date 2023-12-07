import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { join } from 'path'; // Importa la función 'join' de Node.js para trabajar con rutas
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configurar Axios para usar body-parser
  const cors = require('cors');
  app.use(bodyParser.json());
  app.use(cors());
  app.enableCors();
  app.use(cors({
    origin: '*',
    credentials: true,
  }));
  const allowedOrigins = ['http://localhost:3000']; // Reemplaza con el dominio de tu aplicación front-end

  app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }));

  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
  app.use('/images', express.static(join(__dirname, '..', 'images')));
  app.use('/videos', express.static(join(__dirname, '..', 'videos')));
  app.use('/voices', express.static(join(__dirname, '..', 'voices')));
  app.use('/content', express.static(join(__dirname, '..', 'content')));
  app.use((req, res, next) => {
    res.setHeader('Accept-Ranges', 'none');
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap(); //asdasd
