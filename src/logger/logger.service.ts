import { Injectable } from '@nestjs/common';
import { WriteStream, createWriteStream } from 'fs';

@Injectable()
export class LoggerService {
  logHttp(line: String) {
    let stream: WriteStream;
    let date = new Date().toISOString().split('T')[0]
    let path = `/home/zachia-dev/fyp/log/${date}.log`
    stream = createWriteStream(path, { flags: 'a+' });

    stream.write(line);
    stream.end('\n')
  }

  logWs(line: String) {
    let stream: WriteStream;
    let date = new Date().toISOString().split('T')[0]
    let path = `/home/zachia-dev/fyp/command_log/${date}.log`
    stream = createWriteStream(path, { flags: 'a+' });

    stream.write(line);
    stream.end('\n')
  }
}
