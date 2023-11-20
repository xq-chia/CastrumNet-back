import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { Host } from 'src/entity/host.entity';
import { NodeSSH } from 'node-ssh';

@Injectable()
export class HostService {
  ssh: NodeSSH = new NodeSSH();

  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection,
  ) {}

  async save(host: Host): Promise<boolean> {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO host (host, ipAddress) VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [host.host, host.ipAddress])

    if (sqlResult.affectedRow == 1) {
      return true;
    } else {
      return false;
    }
  }

  async findAll() {
    let sql: string;
    let hosts: Host[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM host';

    sqlResult = await this.connection.query(sql);
    sqlResult.forEach(row => {
      let host: Host;

      host = new Host(row.host, row.ipAddress, row.hostId)

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
    host = new Host(sqlResult.host, sqlResult.ipAddress, sqlResult.hostId)

    return host;
  }

  async testConn(ipAddress: string) {
    try {
      await this.ssh.connect({
        host: `${ipAddress}`,
        username: 'zachia-dev',
        privateKeyPath: '/home/zachia-dev/.ssh/id_rsa'
      })

      return true;
    } catch (err) {
      return false;
    }
  }
}
