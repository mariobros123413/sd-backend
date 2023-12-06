import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import fetch from 'node-fetch';
import { pipeline } from 'stream/promises';
const { getAudioDurationInSeconds } = require('get-audio-duration');
@Injectable()
export class TextElService {
  constructor(
  ) { }

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

  async genVoice(textVoice: any, modelSelect: string) {
    try {
      const modelId = modelSelect === 'Adam' ? 'eleven_multilingual_v2' : 'eleven_multilingual_v1';
      const stability = modelSelect === 'Adam' ? 0.84 : 0.50;
      const similarityBoost = modelSelect === 'Adam' ? 0.16 : 0.82;

      const requestBody = JSON.stringify({
        text: textVoice,
        model_id: modelId,
        voice_settings: {
          stability: stability,
          similarity_boost: similarityBoost,
        },
      });

      const apiUrl = modelSelect === 'Adam' ?
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
      console.log(`response: ${JSON.stringify(response)}`);
      const userId = 'nickusuario';
      const projectId = 'idproject';
      const audioName = `${userId}-${projectId}-${Date.now()}.mp3`;

      const audioPathRelative = path.join('voices', userId, projectId, audioName);
      // const audioPathFull = path.resolve(__dirname, '..', audioPathRelative);

      await fs.mkdir(path.dirname(audioPathRelative), { recursive: true });
      const fileStream = fs.createWriteStream(audioPathRelative, { encoding: 'binary' });

      await pipeline(response.body, fileStream);

      console.log('Audio descargado y guardado en', audioPathRelative);
      // Obtener el tamaño del cuerpo de la respuesta en bytes
      const contentLengthHeader = response.headers.get('Content-Length');

      // Verificar si contentLengthHeader es un valor numérico
      const contentLength = Number(contentLengthHeader);
      // Calcular la duración estimada en segundos (ejemplo: asumiendo una tasa de bits de 128 kbps)
      const estimatedDurationSeconds = Math.ceil((contentLength / (128 * 1024)) * 8);

      console.log(`Duración estimada del audio: ${estimatedDurationSeconds} segundos`);
      ////////
      return { audioPathRelative, estimatedDurationSeconds };
    } catch (error) {
      console.error('Error en genVoice:', error);
      throw new Error('Error en genVoice: ' + error);
    }
  }

}
