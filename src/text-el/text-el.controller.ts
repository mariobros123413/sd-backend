import { Controller, Post, Body, Res } from '@nestjs/common';
import { TextElService } from './text-el.service';
import * as fs from 'fs';
import fetch from 'node-fetch';
import { promisify } from 'util';
const pipeline = promisify(require('stream').pipeline);
const CHUNK_SIZE = 1024;
@Controller('text-el')
export class TextElController {
    private readonly API_KEY = 'bb20c1df6a05471871d75dbf8b376900'; // Reemplaza esto con tu clave de API de Stable Diffusion
    private readonly API_URL = 'https://api.elevenlabs.io/v1/text-to-speech/';
    constructor(private readonly textElService: TextElService) { }

    @Post()
    async createNarracion(@Body() body: any): Promise<string> {
        const cuerpo = JSON.stringify({
            "text": `${body.text}`,
            "model_id": `${body.model}`,
            "voice_settings": {
                "stability": `${body.stability}`,
                "similarity_boost": `${body.boost}`
            }
        });
        console.log("cuerpot", cuerpo)
        const urlId = `${this.API_URL}${body.voiceid}`;
        console.log("urlID", urlId);

        const response = await fetch(urlId, {
            method: 'POST',
            headers: {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": this.API_KEY
            },
            body: cuerpo
        });
        if (response.status !== 200) {
            throw new Error(`Error al solicitar el audio. Código de estado: ${response.status}`);
        }

        const outputFile = 'output.mp3';
        const fileStream = fs.createWriteStream(outputFile, { encoding: 'binary' });

        await pipeline(response.body, fileStream);

        console.log('Audio descargado y guardado en', outputFile);

        return 'Audio descargado y guardado en ' + outputFile;
    }
}
