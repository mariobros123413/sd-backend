import { Controller, Post, Body, Get, NotFoundException, Response } from '@nestjs/common';
import { TextElService } from './text-el.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Controller('text-el')
export class TextElController {
    private readonly subscriptions: any[] = []; // Almacena las suscripciones
    constructor(private readonly textElService: TextElService, private readonly eventEmitter: EventEmitter2,
    ) { }

    @Post()
    async createNarracion(@Body() body: any) {
        try {
            const voiceurl = await this.textElService.genVoice(body.textVoice, body.modelSelect, body.usuario, body.historia);
            console.log('VOICE URL:', `${process.env.URL_BACKEND}/${voiceurl}`);

            // Puedes emitir un evento o realizar acciones adicionales según tus necesidades
            this.eventEmitter.emit('voicereceived', `${process.env.URL_BACKEND}/${voiceurl}`);
        } catch (error) {
            throw new NotFoundException(`Error al crearNarracion Backend: ${error}.`);
        }
    }

    @Get('/sse')
    async sse(@Response() res: any): Promise<void> {
        console.log("Conexión SSEV establecida");
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

        // Suscribir al evento 'voicereceived' y enviar datos al cliente cuando ocurra
        const onData = (data: any) => {
            res.write(`data: ${(data)}\n\n`);
        };

        const subscription = this.eventEmitter.on('voicereceived', onData);

        // Almacenar la suscripción para desuscribirse más tarde
        this.subscriptions.push({
            event: 'voicereceived',
            listener: onData,
        });

        // Emitir un mensaje inicial
        res.write(`data: Conexión SSEV establecida\n\n`);

        // Mantener la conexión abierta

        // Limpiar intervalos y suscripciones cuando se cierre la conexión
        res.on('close', () => {
            console.log("Conexión SSE cerrada");
            this.subscriptions.forEach(subscription => {
                this.eventEmitter.removeListener(subscription.event, subscription.listener);
            });
        });
    }
}
