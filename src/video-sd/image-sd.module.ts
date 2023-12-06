import { Module } from '@nestjs/common';
import { ImageSdController } from './image-sd.controller';
import { ImageSdService } from './image-sd.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TextSdModule } from 'src/text-el/text-el.module';
import { TextElService } from 'src/text-el/text-el.service';
@Module({
  imports: [TextSdModule],
  controllers: [ImageSdController],
  providers: [ImageSdService, EventEmitter2, TextElService],
  exports: [ImageSdService]
})
export class ImageSdModule { }
