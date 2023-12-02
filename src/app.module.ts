import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoSdModule } from './video-sd/image-sd.module';
import { TextElController } from './text-el/text-el.controller';
import { TextElModule } from './text-el/text-el.module';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [VideoSdModule, TextElModule, DiscordModule, ConfigModule.forRoot(), EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, TextElController],
  providers: [AppService],
})
export class AppModule { }
