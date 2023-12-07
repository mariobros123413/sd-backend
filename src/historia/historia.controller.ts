import { Controller, Post, Body, Param, NotFoundException, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HistoriaService } from './historia.service';

@Controller('historia')
export class HistoriaController {
    constructor(private readonly historiaService: HistoriaService) { }

    @Post(':username/:historia/crear')
    async crearHistoria(
        @Param('username') username: string,
        @Param('historia') historia: string
    ): Promise<string> {
        try {
            // Lógica para crear la carpeta de la historia
            await this.historiaService.crearCarpetaHistoria(username, historia);
            return `Carpeta de historia creada exitosamente.`;
        } catch (error) {
            throw new HttpException(`Error al crear la carpeta de la historia: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post(':username/:historia/videos')
    async agregarVideoAHistoria(
        @Param('username') username: string,
        @Param('historia') historia: string,
        @Body() body: { videoUrl: string }
    ): Promise<string> {
        try {
            // Lógica para agregar el video a la historia (guardar la URL del video, por ejemplo)
            await this.historiaService.agregarVideo(username, historia, body.videoUrl);
            return 'Video agregado a la historia exitosamente.';
        } catch (error) {
            throw new NotFoundException(`Error al agregar video a la historia: ${error}`);
        }
    }

    @Get(':username/:historia/generar')
    async generarHistoria(
        @Param('username') username: string,
        @Param('historia') historia: string
    ): Promise<string> {
        try {
            // Lógica para generar la historia (combinar los videos) y obtener la URL resultante
            const historiaUrl = await this.historiaService.generarHistoria(username, historia);
            return `${process.env.URL_BACKEND}/${historiaUrl}`;
        } catch (error) {
            throw new NotFoundException(`Error al generar historia: ${error}`);
        }
    }
}
