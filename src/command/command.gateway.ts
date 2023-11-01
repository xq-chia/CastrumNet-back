import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class CommandGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): string {
    return 'Hello client!';
  }
}
