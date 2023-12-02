import { Controller, Post, Body, HttpServer, Sse, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ImageSdService } from './image-sd.service';
import express from 'express';

@Controller('image-sd')
export class ImageSdController {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly imageSDservice: ImageSdService,
    ) { }

    @Post()
    async createVideo(@Body() body: any): Promise<any> {
        try {
            const imageUrl = await this.imageSDservice.genImage(body);
            return 'Solicitud en proceso. Esperando la disponibilidad de la imagen...';
        } catch (error) {
            throw new NotFoundException(`Error al setPersonasFoto Backend: ${error}.`);
        }
    }

    // Nuevo endpoint para el webhook
    @Post('/webhook')
    async webhook(@Body() body: any): Promise<void> {
        // Aquí puedes manejar la imagen que te envía Stable Diffusion
        console.log('Imagen recibida:', body);
        // Puedes emitir un evento o realizar acciones adicionales según tus necesidades
        this.eventEmitter.emit('imageReceived', body);
    }

    // // Agrega este método para crear el servidor express
    // onModuleInit() {
    //     const expressApp = express();
    //     expressApp.use(express.json());
    //     expressApp.post('/image-sd/webhook', (req, res) => this.webhook(req.body));

    //     const server = expressApp.listen(3000, () => {
    //         console.log('Webhook listening on port 3001');
    //     });

    //     // Puedes guardar el servidor express en el eventoEmitter para cerrarlo correctamente cuando sea necesario
    //     this.eventEmitter.emit('expressServer', server);
    // }
}
