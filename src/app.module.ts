import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageSdModule } from './video-sd/image-sd.module';
import { TextElController } from './text-el/text-el.controller';
import { TextSdModule } from './text-el/text-el.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // Importa la función 'join' de Node.js para trabajar con rutas
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entity/usuario.entity';
import { Historia } from './entity/historia.entity';
import { Video } from './entity/video.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { HistoriaModule } from './historia/historia.module';

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

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        url: configService.get('DATABASE_URL'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        // host: 'localhost',
        // port: 5432,
        // password: 'jose',
        // entities: [Usuario, Historia, Video],
        // database: 'drawlybd',
        // username: 'postgres',
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ImageSdModule,
    TextSdModule,
    DiscordModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    UsuarioModule,
    HistoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
