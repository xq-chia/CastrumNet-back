import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Connection } from 'mariadb';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection
  ) {}

  async update(user: User): Promise<boolean> {
    let sql: string;
    let sqlResult: any;

    if (user.loginAttempt == undefined) {
      user.loginAttempt = 0
    }

    if (user.password.type) {
      sql = 'UPDATE user SET username = ?, firstName = ?, lastName = ?, tenantId = ?, status = ?, loginAttempt = ? WHERE userId = ?';
      sqlResult = await this.connection.query(sql, [user.username, user.firstName, user.lastName, user.tenantId, user.status, user.loginAttempt, user.userId]);
    } else {
      sql = 'UPDATE user SET username = ?, password = ?, firstName = ?, lastName = ?, tenantId = ?, status = ?, loginAttempt = ? WHERE userId = ?';
      sqlResult = await this.connection.query(sql, [user.username, user.password, user.firstName, user.lastName, user.tenantId, user.status, user.loginAttempt, user.userId]);
    }
    
    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      throw new HttpException('User update failed', HttpStatus.BAD_REQUEST, {
        description: 'user is not edited'
      })
    }
  }

  async toggleStatus(userId: number): Promise<boolean> {
    let sql: string;
    let sqlResult: any;

    sql = 'UPDATE user SET status = !status WHERE userId = ?';
    sqlResult = await this.connection.query(sql, [userId]);

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      throw new HttpException('Status update failed', HttpStatus.BAD_REQUEST, {
        description: 'status column is not updated'
      })
    }
  }

  async save(user: User) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO user (username, password, firstName, lastName, tenantId, status) VALUES (?, ?, ?, ?, ?, ?)';
    sqlResult = await this.connection.query(sql, [user.username, user.password, user.firstName, user.lastName, user.tenantId, 1])

    return sqlResult.insertId
  }

  async findAll(): Promise<User[]> {
    let sql: string;
    let users: User[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM user';

    sqlResult = await this.connection.query(sql);
    for (const row of sqlResult) {
      let user: User;

      user = new User(row.username, row.password, row.firstName, row.lastName, !!row.status, row.tenantId, row.userId, row.loginAttempt);

      users.push(user);
    }

    return users;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    let sql: string;
    let user: User = null;
    let sqlResult: any;

    sql = 'SELECT * FROM user WHERE username = ?';
    sqlResult = await this.connection.query(sql, [username]);

    if (sqlResult.length != 0) {
      let row: any;
      row = sqlResult[0];
      user = new User(row.username, row.password, row.firstName, row.lastName, !!row.status, row.tenantId, row.userId, row.loginAttempt);
    }

    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    let sql: string;
    let user: User = null;
    let sqlResult: any;

    sql = 'SELECT * FROM user WHERE userId = ?';
    sqlResult = await this.connection.query(sql, [id]);

    if (sqlResult.length != 0) {
      let row: any;
      row = sqlResult[0];
      user = new User(row.username, row.password, row.firstName, row.lastName, !!row.status, row.tenantId, row.userId, row.loginAttempt);
    }

    return user;
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM user WHERE userId = ?';
    sqlResult = await this.connection.query(sql, [userId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      throw new HttpException('Deletion failed', HttpStatus.BAD_REQUEST, {
        description: 'user are not deleted'
      });
    }
  }
}
