import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import * as os from 'os';
import * as pty from 'node-pty';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class CommandGateway implements OnGatewayInit {
  readonly shell: string = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  ptyProcess = pty.spawn(this.shell, [], {
    name: 'xterm-color',
    env: process.env
  })

  afterInit(server: Server) {
    this.ptyProcess.onData(output => {
      server.send(output)
    })
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string) {
    this.ptyProcess.write(message);
  }
}
