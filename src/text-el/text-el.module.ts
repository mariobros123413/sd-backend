import { Module } from '@nestjs/common';
import { TextElService } from './text-el.service';
import { TextElController } from './text-el.controller';

@Module({
    controllers: [TextElController],
    providers: [TextElService],
    exports: [TextElService]
})
export class TextElModule { }
