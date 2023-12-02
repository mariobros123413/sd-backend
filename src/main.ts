import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
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
  await app.listen(3001);
}
bootstrap(); //asdasd
