import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as os from 'os';
import * as pty from 'node-pty';
import { Server } from 'socket.io';
import { RbacService } from 'src/rbac/rbac.service';

@WebSocketGateway({ cors: true })
export class CommandGateway implements OnGatewayInit {
  readonly shell: string = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  ptyProcess = pty.spawn(this.shell, [], {
    name: 'xterm-color',
    env: process.env
  })
  buffer: string = '';
  @WebSocketServer() server: Server;

  constructor(private rbacService: RbacService) { }

  afterInit(server: Server) {
    this.ptyProcess.onData(output => {
      server.send(output)
    })
  }

  @SubscribeMessage('init')
  async handleInit() {
    this.ptyProcess.write('ssh zachia-dev@127.0.0.1')
    this.ptyProcess.write('\u000d')
    await new Promise(resolve => setTimeout(resolve, 50));
    this.ptyProcess.write('xq010614chia')
    this.ptyProcess.write('\u000d')
    await new Promise(resolve => setTimeout(resolve, 1));
    this.ptyProcess.write('\u000c')
  }

  @SubscribeMessage('buffer')
  handleBuffer(@MessageBody() buffer: string) {
    this.buffer = buffer.trim();
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string) {
    // enter
    if (message == '\u000d' && this.buffer && this.ptyProcess.process == 'bash') {
      if (!this.rbacService.checkPermission(this.buffer)) {
        this.server.emit('error', 'You do not have the permission to execute the command');
        this.clearBuffer();
        return ;
      }
    }
    this.ptyProcess.write(message);
  }

  clearBuffer() {
    this.ptyProcess.write('\u0015');
  }
}
