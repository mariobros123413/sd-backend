import { Controller, Post, Body, Get, Response, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ImageSdService } from './image-sd.service';
interface Subscription {
    event: string;
    listener: Function;
}
@Controller('image-sd')
export class ImageSdController {
    private readonly subscriptions: any[] = []; // Almacena las suscripciones

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

    // Endpoint para el cliente que quiere suscribirse a eventos SSE
    @Get('/sse')
    async sse(@Response() res: any): Promise<void> {
        console.log("Conexión SSE establecida");
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Manejar cierre de conexión
        res.on('close', () => {
            console.log("Conexión SSE cerrada");
            // Desuscribir todos los eventos al cerrar la conexión
            this.subscriptions.forEach(subscription => {
                this.eventEmitter.removeListener(subscription.event, subscription.listener);
            });
        });

        // Suscribir al evento 'imageReceived' y enviar datos al cliente cuando ocurra
        const onData = (data: any) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        const subscription = this.eventEmitter.on('imageReceived', onData);

        // Almacenar la suscripción para desuscribirse más tarde
        this.subscriptions.push({
            event: 'imageReceived',
            listener: onData,
        });

        // Emitir un mensaje inicial
        res.write(`data: Conexión SSE establecida\n\n`);

        // Mantener la conexión abierta
        const pingInterval = setInterval(() => {
            res.write(`data: Ping\n\n`);
        }, 10000);

        // Limpiar intervalos y suscripciones cuando se cierre la conexión
        res.on('close', () => {
            console.log("Conexión SSE cerrada");
            clearInterval(pingInterval);
            this.subscriptions.forEach(subscription => {
                this.eventEmitter.removeListener(subscription.event, subscription.listener);
            });
        });
    }
}
