import { Injectable } from '@nestjs/common';
import { WriteStream, createWriteStream, existsSync, mkdirSync } from 'fs';

@Injectable()
export class LoggerService {
  logHttp(line: String) {
    let stream: WriteStream;
    let date = new Date().toISOString().split('T')[0]
    let directory = '/home/zachia-dev/fyp/log'
    
    if (!existsSync(directory)) {
      mkdirSync(directory)
    }

    let path = `${directory}/${date}.log`
    stream = createWriteStream(path, { flags: 'a+' });

    stream.write(line);
    stream.end('\n')
  }

  logWs(line: String) {
    let stream: WriteStream;
    let date = new Date().toISOString().split('T')[0]
    let directory = '/home/zachia-dev/fyp/command_log'
    
    if (!existsSync(directory)) {
      mkdirSync(directory)
    }

    let path = `${directory}/${date}.log`
    stream = createWriteStream(path, { flags: 'a+' });

    stream.write(line);
    stream.end('\n')
  }
}
