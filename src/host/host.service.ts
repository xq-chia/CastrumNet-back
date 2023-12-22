import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { Host } from 'src/entity/host.entity';
import { NodeSSH } from 'node-ssh';
import { Socket, io } from 'socket.io-client';

@Injectable()
export class HostService {
  ssh: NodeSSH = new NodeSSH();

  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection,
  ) {}

  async save(host: Host): Promise<number> {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO host (host, ipAddress) VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [host.host, host.ipAddress])

    return sqlResult.insertId
  }

  async findAll() {
    let sql: string;
    let hosts: Host[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM host';

    sqlResult = await this.connection.query(sql);
    for (const row of sqlResult) {
      let host: Host;
      host = new Host(row.host, row.ipAddress, row.hostId)
      hosts.push(host)
    }

    return hosts;
  }

  async findOneByHostId(hostId: number): Promise<Host | undefined> {
    let sql: string;
    let host: Host;
    let sqlResult: any;

    sql = 'SELECT * FROM host WHERE hostId = ?';

    sqlResult = (await this.connection.query(sql, [hostId]));
    if (sqlResult.lenth != 0) {
      let row: any;
      row = sqlResult[0];
      host = new Host(row.host, row.ipAddress, row.hostId)
    }

    return host;
  }

  async update(host: Host) {
    let sql: string;
    let sqlResult: any;

    sql = 'UPDATE host SET host = ?, ipAddress = ? WHERE hostId = ?';
    sqlResult = await this.connection.query(sql, [host.host, host.ipAddress, host.hostId]);

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      throw new HttpException('Host update failed', HttpStatus.BAD_REQUEST, {
        description: 'host is not edited'
      })
    }
  }

  async deleteByHostId(hostId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM host WHERE hostId = ?';
    sqlResult = await this.connection.query(sql, [hostId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      throw new HttpException('Deletion failed', HttpStatus.BAD_REQUEST, {
        description: 'host are not deleted'
      });
    }
  }
}
