import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Connection } from 'mariadb';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection
  ) {}

  async updateStatus(userId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'UPDATE user SET status = 0 WHERE userId = ?';
    sqlResult = await this.connection.query(sql, [userId]);

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }

  async save(user: User) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO user VALUES (?, ?, ?, ?, ?, ?)';
    sqlResult = await this.connection.query(sql, [user.userId, user.username, user.password, user.firstName, user.lastName, user.tenantId, 1])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }

  async findAll() {
    let sql: string;
    let users: User[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM user';

    sqlResult = await this.connection.query(sql);
    sqlResult.forEach(row => {
      let user: User;

      user = new User(row.userId, row.username, row.password, row.firstName, row.lastName, row.tenantId)

      users.push(user)
    });

    return users;
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    let sql: string;
    let user: User;
    let sqlResult: any;

    sql = 'SELECT * FROM user WHERE username = ?';

    sqlResult = (await this.connection.query(sql, [username]))[0];
    user = new User(sqlResult.userId, sqlResult.username, sqlResult.password, sqlResult.firstName, sqlResult.lastName, sqlResult.tenantId)

    return user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    let sql: string;
    let user: User;
    let sqlResult: any;

    sql = 'SELECT * FROM user WHERE userId = ?';

    sqlResult = (await this.connection.query(sql, [id]))[0];
    user = new User(sqlResult.userId, sqlResult.username, sqlResult.password, sqlResult.firstName, sqlResult.lastName, sqlResult.tenantId)

    return user;
  }
}
