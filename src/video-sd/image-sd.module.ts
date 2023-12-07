import { Module } from '@nestjs/common';
import { ImageSdController } from './image-sd.controller';
import { ImageSdService } from './image-sd.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TextSdModule } from 'src/text-el/text-el.module';
import { TextElService } from 'src/text-el/text-el.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/entity/video.entity';
import { Historia } from 'src/entity/historia.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { Usuario } from 'src/entity/usuario.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Historia, Video]),TextSdModule, UsuarioModule],
  controllers: [ImageSdController],
  providers: [ImageSdService, EventEmitter2, TextElService],
  exports: [ImageSdService]
})
export class ImageSdModule { }
