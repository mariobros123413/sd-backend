import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import fetch from 'node-fetch';
import { pipeline } from 'stream/promises';

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

  async genVoice(body: any) {
    try {
      const modelId = body.model === 'Adam' ? 'eleven_multilingual_v2' : 'eleven_multilingual_v1';
      const stability = body.model === 'Adam' ? 0.84 : 0.50;
      const similarityBoost = body.model === 'Adam' ? 0.16 : 0.82;

      const requestBody = JSON.stringify({
        text: body.text,
        model_id: modelId,
        voice_settings: {
          stability: stability,
          similarity_boost: similarityBoost,
        },
      });

      const apiUrl = body.model === 'Adam' ?
        'https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB' :
        'https://api.elevenlabs.io/v1/text-to-speech/ThT5KcBeYPX3keUQqHPh';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.API_KEY_ELEVENS,
        },
        body: requestBody,
      });

      console.log('Request Body:', requestBody);

      if (response.status !== 200) {
        throw new Error(`Error al solicitar el audio. Código de estado: ${response.status}`);
      }

      const userId = 'nickusuario';
      const projectId = 'idproject';
      const audioName = `${userId}-${projectId}-${Date.now()}.mp3`;

      const audioPathRelative = path.join('voices', userId, projectId, audioName);
      // const audioPathFull = path.resolve(__dirname, '..', audioPathRelative);

      await fs.mkdir(path.dirname(audioPathRelative), { recursive: true });
      const fileStream = fs.createWriteStream(audioPathRelative, { encoding: 'binary' });

      await pipeline(response.body, fileStream);

      console.log('Audio descargado y guardado en', audioPathRelative);

      return audioPathRelative;
    } catch (error) {
      console.error('Error en genVoice:', error);
      throw new Error('Error en genVoice: ' + error);
    }
  }


}
