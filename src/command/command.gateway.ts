import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as os from 'os';
import * as pty from 'node-pty';
import { Server } from 'socket.io';
import { RbacService } from 'src/rbac/rbac.service';
import { HostService } from 'src/host/host.service';
import { Host } from 'src/entity/host.entity';
import { LoggerService } from 'src/logger/logger.service';

@WebSocketGateway({ cors: true })
export class CommandGateway implements OnGatewayInit {
  readonly shell: string = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  ptyProcess = pty.spawn(this.shell, [], {
    name: 'xterm-color',
    env: process.env
  })
  buffer: string = '';
  @WebSocketServer() server: Server;

  constructor(
    private rbacService: RbacService,
    private hostService: HostService,
    private loggerSrv: LoggerService
    ) { }

  afterInit(server: Server) {
    this.ptyProcess.onData(output => {
      server.send(output)
    })
  }

  @SubscribeMessage('init')
  async handleInit(@MessageBody() hostId: number) {
    let host: Host;

    host = await this.hostService.findOneByHostId(hostId)

    this.ptyProcess.write(`ssh zachia-dev@${host.ipAddress}`)
    this.ptyProcess.write('\u000d')
    await new Promise(resolve => setTimeout(resolve, 10));
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
      let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur', });
      this.loggerSrv.logWs(`[REQ] ${time} ${this.buffer}`)
      if (!this.rbacService.checkPermission(this.buffer)) {
        this.server.emit('error', 'You do not have the permission to execute the command');
        this.clearBuffer();
        this.loggerSrv.logWs('[RES] REJECTED')
        return ;
      }
      this.loggerSrv.logWs('[RES] ACCEPTED')
    }
    this.ptyProcess.write(message);
  }

  clearBuffer() {
    this.ptyProcess.write('\u0015');
  }
}
