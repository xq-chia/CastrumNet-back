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
}
