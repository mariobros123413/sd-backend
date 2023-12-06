import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageSdModule } from './video-sd/image-sd.module';
import { TextElController } from './text-el/text-el.controller';
import { TextSdModule } from './text-el/text-el.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // Importa la función 'join' de Node.js para trabajar con rutas

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'), // Ruta a tu carpeta 'public'
      serveRoot: '/images', // Ruta base para servir los archivos estáticos
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'videos'), // Ruta a tu carpeta 'public'
      serveRoot: '/videos', // Ruta base para servir los archivos estáticos
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'voices'), // Ruta a tu carpeta 'public'
      serveRoot: '/voices', // Ruta base para servir los archivos estáticos
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'content'), // Ruta a tu carpeta 'public'
      serveRoot: '/content', // Ruta base para servir los archivos estáticos
    }),
    ImageSdModule,
    TextSdModule,
    DiscordModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
