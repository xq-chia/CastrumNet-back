import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { Role } from 'src/entity/role.entity';

@Injectable()
export class RoleService {
    constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(role: Role): Promise<number> {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO role (role, description) VALUES (?, ?) RETURNING roleId';
    sqlResult = await this.connection.query(sql, [role.role, role.description])

    return sqlResult[0].roleId
  }

  async update(role: Role) {
    let sql: string;
    let sqlResult: any;

    sql = 'UPDATE role SET role = ?, description = ? WHERE roleId = ?';
    sqlResult = await this.connection.query(sql, [role.role, role.description, role.roleId]);

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }

  }

  async findAll(): Promise<Role[]> {
    let sql: string;
    let roles: Role[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM role';

    sqlResult = await this.connection.query(sql);
    sqlResult.forEach(row => {
      let role: Role;

      role = new Role(row.role, row.description, row.roleId);

      roles.push(role);
    });

    return roles;
  }

  async findOneByRoleId(roleId: number): Promise<Role | undefined> {
    let sql: string;
    let role: Role;
    let sqlResult: any;

    sql = 'SELECT * FROM role WHERE roleId = ?';

    sqlResult = (await this.connection.query(sql, [roleId]))[0];
    role = new Role(sqlResult.role, sqlResult.description, sqlResult.roleId);

    return role;
  }

  async deleteByRoleId(roleId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM role WHERE roleId = ?';
    sqlResult = await this.connection.query(sql, [roleId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
  }
}
