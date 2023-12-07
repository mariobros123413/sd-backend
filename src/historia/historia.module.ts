import { Module } from '@nestjs/common';
import { HistoriaController } from './historia.controller';
import { HistoriaService } from './historia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/entity/usuario.entity';
import { Historia } from 'src/entity/historia.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Usuario, Historia])],
  controllers: [HistoriaController],
  providers: [HistoriaService]
})
export class HistoriaModule {}
