import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import * as os from 'os';
import * as pty from 'node-pty'

@WebSocketGateway({ cors: true })
export class CommandGateway {
  readonly shell: string = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  readonly ptyProcess = pty.spawn(this.shell, [], {
    name: 'xterm-color',
    env: process.env
  })

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string) {
    this.ptyProcess.write(message + '\r');

    // buggy
    this.ptyProcess.onData(output => {
      console.log('comamnd: ', message)
      console.log('return: ', output)
    })
  }
}
