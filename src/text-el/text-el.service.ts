import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import fetch from 'node-fetch';

@Injectable()
export class TextElService {
  async downloadAndSaveVideo(videoUrl: string): Promise<void> {
    console.log('vamos a descargar')
    const response = await fetch(videoUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (response) {
      const videoBuffer = await response.buffer();
      fs.writeFileSync('./videos/video.mp4', videoBuffer); // Guardar el video como un archivo local
      console.log('Video descargado y guardado localmente.');
    } else {
      console.error('Error al descargar el video. Código de estado:', response.status);
    }
  }
}
