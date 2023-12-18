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

  async findAllByRoleId(roleId: number): Promise<File[]> {
    let sql: string;
    let sqlResult: any;
    let files: File[];

    files = [];

    sql = 'SELECT * FROM file WHERE roleId = ?';

    sqlResult = await this.connection.query(sql, [roleId]);
    for (const row of sqlResult) {
      let file: File;
      file = new File(row.path, row.roleId, row.fileId);
      files.push(file);
    }

    return files;
  }
}