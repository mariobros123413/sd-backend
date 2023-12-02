import { Module } from '@nestjs/common';
import { ImageSdController } from './image-sd.controller';
import { ImageSdService } from './image-sd.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [ImageSdController],
  providers: [ImageSdService, EventEmitter2],
  exports: [ImageSdService]
})
export class VideoSdModule { }
