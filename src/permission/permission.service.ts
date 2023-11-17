import { Inject, Injectable } from '@nestjs/common';
import { Permission } from 'src/entity/permission.entity';
import { Connection } from 'mariadb';

@Injectable()
export class PermissionService {
  constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(permission: Permission) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO permission (object, allow, roleId) VALUES (?, ?, ?)';
    sqlResult = await this.connection.query(sql, [permission.object, permission.allow, permission.roleId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }

  async findAllByRoleId(roleId: number): Promise<Permission[]> {
    let sql: string;
    let sqlResult: any;
    let permissions: Permission[];

    permissions = [];

    sql = 'SELECT * FROM permission WHERE roleId = ?';

    sqlResult = await this.connection.query(sql, [roleId]);
    for (const row of sqlResult) {
      permissions.push(
        new Permission(
          row.object, 
          !!row.allow, 
          row.roleId,
          row.permId
        ),
      );
    }

    return permissions;
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
          row.object, 
          !!row.allow, 
          row.roleId,
          row.permId
        ),
      );
    }

    return permissions;
  }

  async deleteAllByRoleId(roleId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM permission WHERE roleId = ?';
    sqlResult = await this.connection.query(sql, [roleId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }

  async updateAllByRoleId(roleId: number, permissions: Permission[]) {
    this.deleteAllByRoleId(roleId);
    for (const permission of permissions) {
      this.save(permission)
    }
  }
}
