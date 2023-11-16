import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { Host } from 'src/entity/host.entity';

@Injectable()
export class HostService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection
  ) {}

  async findAll() {
    let sql: string;
    let hosts: Host[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM host';

    sqlResult = await this.connection.query(sql);
    sqlResult.forEach(row => {
      let host: Host;

      host = new Host(row.hostId, row.host, row.ipAddress)

      hosts.push(host)
    });

    return hosts;
  }

  async findOneByHostId(hostId: number): Promise<Host | undefined> {
    let sql: string;
    let host: Host;
    let sqlResult: any;

    sql = 'SELECT * FROM host WHERE hostId = ?';

    sqlResult = (await this.connection.query(sql, [hostId]))[0];
    host = new Host(sqlResult.hostId, sqlResult.findOneByHostId, sqlResult.ipAddress)

    return host;
  }
}
