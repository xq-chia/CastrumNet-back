import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { UserHost } from 'src/entity/user_host.entity';

@Injectable()
export class UserHostService {
  constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(userHost: UserHost) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO user_host (userId, hostId) VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [userHost.userId, userHost.hostId]);

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }

  async findAllByUserId(userId: number): Promise<UserHost[]> {
    let sql: string;
    let sqlResult: any;
    let userHosts: UserHost[] = [];

    sql = "SELECT * FROM user_host WHERE userId = ?";

    sqlResult = (await this.connection.query(sql, [userId]));

    for (const row of sqlResult) {
      let userHost: UserHost;

      userHost = new UserHost(row.userId, row.hostId, row.userHostId);

      userHosts.push(userHost);
    }

    return userHosts;
  }

  async deleteAllByUserHostId(userHostId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM user_host WHERE userHostId = ?';
    sqlResult = await this.connection.query(sql, [userHostId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }

  async deleteAllByUserId(userId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM user_host WHERE userId = ?';
    sqlResult = await this.connection.query(sql, [userId])
  }
}
