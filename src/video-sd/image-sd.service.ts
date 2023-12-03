import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import fetch from 'node-fetch';
import axios from 'axios';
var request = require('request');
@Injectable()
export class ImageSdService {
  async downloadAndSaveVideo(videoUrl: string): Promise<void> {
    console.log('vamos a descargar')
    const response = await fetch(videoUrl, {
      method: 'POST',
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


  async genImage(body: any) {
    const additionalPrompt = "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K";

    const apiUrl = 'https://stablediffusionapi.com/api/v4/dreambooth';
    const requestData = {
      key: "rosqbr4dkbnIdOwXNZEeHrXknYNwAZzRrsfjaICwKBDRxhhRuRmbbfZhwEeM",
      model_id: 'drood-disney-pixar',
      prompt: `${body.text} ${additionalPrompt}`,
      negative_prompt: 'painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime',
      width: '512',
      height: '512',
      samples: '1',
      num_inference_steps: '30',
      seed: null,
      guidance_scale: 7.5,
      webhook: "https://f5c1-179-59-173-194.ngrok-free.app/image-sd/webhook",
      track_id: null,
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return "Imagen procesandose";
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      throw new Error('Error al procesar la solicitud');
    }
  }

  async getImageSD(id: any) {
    const apiUrl = 'https://stablediffusionapi.com/api/v4/dreambooth';
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "key": "rosqbr4dkbnIdOwXNZEeHrXknYNwAZzRrsfjaICwKBDRxhhRuRmbbfZhwEeM",
      "request_id": `"${id}"`
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const response = await axios.post(apiUrl, requestOptions, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`response getImagenSD : ${(response.data)}`);
    return response.data.output;
  }

}
