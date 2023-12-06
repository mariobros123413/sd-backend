import { Module } from '@nestjs/common';
import { TextElService } from './text-el.service';
import { TextElController } from './text-el.controller';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  controllers: [TextElController],
  providers: [TextElService, EventEmitter2],
  exports: [TextElService]
})
export class TextSdModule { }