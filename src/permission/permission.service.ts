import { Inject, Injectable } from '@nestjs/common';
import { Permission } from 'src/entity/permission.entity';
import { Connection } from 'mariadb';

@Injectable()
export class PermissionService {
  constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(permission: Permission) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO permission VALUES (?, ?, ?, ?)';
    sqlResult = await this.connection.query(sql, [permission.permId, permission.object, permission.allow, permission.roleId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }

  async findByObject(object: string): Promise<Permission[]> {
    let sql: string;
    let sqlResult: any;
    let permissions: Permission[];

    permissions = [];

    sql = 'SELECT * FROM permission WHERE object = ?';

    sqlResult = await this.connection.query(sql, [object]);
    for (const row of sqlResult) {
      permissions.push(
        new Permission(
          row.permId, 
          row.object, 
          !!row.allow, 
          row.roleId
        ),
      );
    }

    return permissions;
  }
}
