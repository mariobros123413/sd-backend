import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra'; // Importa fs-extra
import fetch from 'node-fetch';
import axios from 'axios';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';

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
    const additionalPrompt = "hyperrealistic, full body, detailed clothing, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f\/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 4K, 8K";

    const apiUrl = 'https://stablediffusionapi.com/api/v4/dreambooth';
    const requestData = {
      key: "rosqbr4dkbnIdOwXNZEeHrXknYNwAZzRrsfjaICwKBDRxhhRuRmbbfZhwEeM",
      model_id: 'drood-disney-pixar',
      prompt: `${body.text} ${additionalPrompt}`,
      negative_prompt: '(child:1.5), ((((underage)))), ((((child)))), (((kid))), (((preteen))), (teen:1.5) ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, bad anatomy, watermark, signature, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy',
      width: '512',
      height: '512',
      samples: '1',
      steps: 20,
      seed: null,
      guidance_scale: 7.5,
      scheduler: "DDPMScheduler",
      webhook: "https://sd-backend-production.up.railway.app/image-sd/webhook",
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

  async generateZoomVideo(imageUrl: string, zoomDuration: number): Promise<string> {
    const userId = 'nickusuario'; // Obtén el ID del usuario de tu lógica de aplicación
    const projectId = 'idproject'; // Obtén el ID del proyecto de tu lógica de aplicación
    const imageExtension = path.extname(imageUrl);
    console.log(`imaext :${imageExtension}`);
    const imageName = path.basename(imageUrl, imageExtension);
    console.log(`imageName :${imageName}`);

    const projectRoot = process.cwd();
    await fs.ensureDir(`src/videos/${userId}/${projectId}`);

    const outputVideoPath = path.join(projectRoot, `src/videos/${userId}/${projectId}/${imageName}.mp4`);
    console.log(`path ${outputVideoPath}`);

    const zoomFactor = 1.5; // Factor de zoom máximo
    const framesPerSecond = 30; // Ajusta según tu preferencia

    const command = ffmpeg()
      .setFfmpegPath(ffmpegInstaller.path)
      .input(imageUrl)
      .inputOptions(['-loop 1'])
      .outputOptions([
        '-c:v libx264',
        '-vf', `zoompan=z='min(zoom+0.0015\\,${zoomFactor})':d=${3 * framesPerSecond}:fps=${framesPerSecond},scale=512:512,format=yuv420p`,
        '-t', `3`,
        '-pix_fmt', 'yuv420p'
      ])
      .on('end', () => {
        console.log('Generación de video completa');
      })
      .on('error', (err) => {
        console.error('Error en la generación del video:', err);
      })
      .save(outputVideoPath);
    await new Promise<void>((resolve, reject) => {
      command.on('end', resolve).on('error', reject);
    });

    return `${outputVideoPath}`;
  }

  async saveImage(imageUrl: string): Promise<string> {
    const userId = 'nickusuario'; // Obtén el ID del usuario de tu lógica de aplicación
    const projectId = 'idproject'; // Obtén el ID del proyecto de tu lógica de aplicación
    const imageName = `${userId}-${projectId}-${Date.now()}.png`;
    const imagePath = `src/images/${userId}/${projectId}/${imageName}`;

    await fs.ensureDir(`src/images/${userId}/${projectId}`);

    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();
    await fs.writeFile(imagePath, imageBuffer);

    return imagePath;
  }
}
