import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as os from 'os';
import * as pty from 'node-pty';
import { Server } from 'socket.io';
import { RbacService } from 'src/rbac/rbac.service';
import { HostService } from 'src/host/host.service';
import { Host } from 'src/entity/host.entity';
import { LoggerService } from 'src/logger/logger.service';
import { UserHostService } from 'src/user_host/user_host.service';
import { UserHost } from 'src/entity/user_host.entity';
import { Socket, io } from 'socket.io-client';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';

@WebSocketGateway({ cors: true })
export class CommandGateway {
  buffer: string = '';
  @WebSocketServer() server: Server;
  userHost: UserHost;
  user: User;
  ptyProcess: Socket;
  process: string = '';

  constructor(
    private rbacService: RbacService,
    private hostService: HostService,
    private loggerSrv: LoggerService,
    private userHostService: UserHostService,
    private userService: UsersService
    ) { }

  @SubscribeMessage('init')
  async handleInit(@MessageBody() userHostId: number) {
    let host: Host;
    let hostId: number;

    this.userHost = await this.userHostService.findOneByUserHostId(userHostId);
    hostId = this.userHost.hostId;
    host = await this.hostService.findOneByHostId(hostId)
    this.user = await this.userService.findOneById(this.userHost.userId)

    this.ptyProcess = io(`ws://${host.ipAddress}:3001`)
    this.ptyProcess.on('message', data => {
      this.process = data.process
      this.server.send(data.output)
    })

    // ctrl-l
    this.ptyProcess.send('\u000c')
  }

  @SubscribeMessage('buffer')
  handleBuffer(@MessageBody() buffer: string) {
    this.buffer = buffer.trim();
  }

  @SubscribeMessage('term')
  handleTerm() {
    this.ptyProcess.off("message")
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string) {
    // enter
    if (message == '\u000d' && this.buffer && this.process == 'bash') {
      let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kuala_Lumpur', });
      this.loggerSrv.logWs(`[REQ] ${time} ${this.buffer} ${this.user.username}`)
      if (!await this.rbacService.checkPermission(this.buffer, this.userHost.userHostId)) {
        this.server.emit('error', 'You do not have the permission to execute the command');
        this.clearBuffer();
        this.loggerSrv.logWs('[RES] REJECTED')
        return ;
      }
      this.loggerSrv.logWs('[RES] ACCEPTED')
    }
    this.ptyProcess.send(message)
  }

  clearBuffer() {
    // ctrl-u
    this.ptyProcess.send('\u0015');
  }
}
