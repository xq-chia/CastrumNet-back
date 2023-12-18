import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { File } from 'src/entity/file.entity';

@Injectable()
export class FileService {
  constructor(
    @Inject('DATABASE_CONNECTION') private connection: Connection
  ) {}

  async save(file: File) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO file (path, roleId) VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [file.path, file.roleId])

    return sqlResult.insertId
  }
}