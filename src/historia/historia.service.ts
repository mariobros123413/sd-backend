import { Injectable } from '@nestjs/common';
import path, { join, extname } from 'path';
import * as fs from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';
import * as ffmpegg from 'fluent-ffmpeg';
import * as fse from 'fs-extra';
import { InjectRepository } from '@nestjs/typeorm';
import { Historia } from 'src/entity/historia.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/entity/usuario.entity';


@Injectable()
export class HistoriaService {
    private historias: Record<string, string[]> = {};
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        @InjectRepository(Historia)
        private historiaRepository: Repository<Historia>,
    ) { }
    async agregarVideo(username: string, historia: string, videoUrl: string): Promise<void> {
        const key = `${username}_${historia}`;

        if (!this.historias[key]) {
            this.historias[key] = [];
        }

        this.historias[key].push(videoUrl);
    }

    async generarHistoria(username: string, historia: string): Promise<string> {
        const key = `${username}_${historia}`;
        const videoDir = path.join('content', username, historia);
        const historiaFilePath = path.join(videoDir, 'historia.mp4');

        // Verificar si historia.mp4 existe y eliminarlo si es necesario
        const historiaExists = await fse.pathExists(historiaFilePath);
        if (historiaExists) {
            console.log('historia.mp4 existe. Eliminando...');
            await fse.unlink(historiaFilePath);
            console.log('historia.mp4 eliminado.');
        }

        // Obtener la lista de archivos de video en el directorio
        const videoFiles = await fs.readdir(videoDir);
        console.log(`videos : ${JSON.stringify(videoFiles)}`);

        // Filtrar solo archivos de video (puedes ajustar según los tipos de video que admitas)
        const videoUrls = videoFiles
            .filter((file) => ['.mp4', '.avi', '.mkv'].includes(path.extname(file).toLowerCase()))
            .map((file) => {
                const encodedFileName = encodeURIComponent(file);
                return `http://localhost:3001/content/${username}/${historia}/${encodedFileName}`;
            });

        console.log(`videoUrls : ${JSON.stringify(videoUrls)}`);

        // Lógica para combinar los videos
        const outputPath = await this.combinarVideos(videoUrls, historiaFilePath);
        console.log(`outputPath : ${JSON.stringify(outputPath)}`);
        // Guardar en la base de datos
        const historiaC = await this.historiaRepository.findOne({ where: { titulo: historia } });
        historiaC.url = `${process.env.URL_BACKEND}/contents/${username}/${historia}/historia.mp4`;
        await this.historiaRepository.save(historiaC);
        return historiaFilePath;
    }

    async crearCarpetaHistoria(username: string, historia: string): Promise<void> {
        const carpetaHistoria = join('content', username, historia);

        try {
            const user = await this.usuarioRepository.findOne({ where: { nombre: username } });
            const historiac = new Historia();
            historiac.titulo = historia;
            historiac.idusuario = user.id;
            await this.historiaRepository.save(historiac);
            // Crear la carpeta de la historia si no existe
            await fs.mkdir(carpetaHistoria, { recursive: true });
        } catch (error) {
            throw new Error(`Error al crear la carpeta de la historia: ${error}`);
        }
    }

    async combinarVideos(videoUrls: string[], outputPath: string): Promise<string> {
        const ffmpegCommand = ffmpeg().setFfmpegPath(path.join('src/ffmpeg/ffmpeg.exe')).setFfprobePath(ffprobe.path);

        videoUrls.forEach((videoUrl) => {
            ffmpegCommand.input(videoUrl);
        });

        return new Promise((resolve, reject) => {
            ffmpegCommand
                .on('end', () => {
                    console.log('Generación de historia completada.');
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    console.error('Error al combinar los videos:', err);
                    reject(err);
                })
                .mergeToFile(outputPath, './temp');
        });
    }


}
