import { Controller, Get, Logger, Res } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('SSE')
@ApiExcludeController()
@Controller('sse')
export class SseController {
    private clients = new Map<string, Response>();
    private readonly logger = new Logger('UsuarioService');

    @Get('stream')
    streamNotifications(@Res() res: Response) {


        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const clientId = Date.now().toString();
        Logger.log('Client connected to SSE stream | ' +clientId);

        this.clients.set(clientId, res);

        res.on('close', () => {
            Logger.log(`Client ${clientId} disconnected`);
            this.clients.delete(clientId);
        });

        return res;
    }

    @Get('send')
    sendNotification() {
        const data = { message: 'Hello, this is a test notification!' };
        
        Logger.log('Sending notification to all clients...');

        for (const [clientId, client] of this.clients) {
            Logger.log(`Sending notification to client ${clientId}`);
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        }

        return { message: 'Notification sent to all clients' };
    }
}
