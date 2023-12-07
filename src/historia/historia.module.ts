import { Module } from '@nestjs/common';
import { HistoriaController } from './historia.controller';
import { HistoriaService } from './historia.service';

@Module({
  controllers: [HistoriaController],
  providers: [HistoriaService]
})
export class HistoriaModule {}
