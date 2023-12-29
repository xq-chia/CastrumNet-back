import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';

@Injectable()
export class RoleInheritanceService {
    constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(role: RoleInheritance) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO role_inheritance (roleId, parentId) VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [role.roleId, role.parentId])

    return sqlResult.insertId;
  }

  async findByRoleId(id: number): Promise<RoleInheritance[] | undefined> {
    let sql: string;
    let inheritances: RoleInheritance[] = [];
    let sqlResult: any[];

    sql = 'SELECT * FROM role_inheritance WHERE roleId = ?';

    sqlResult = (await this.connection.query(sql, [id]));
    for (let row of sqlResult) {
        let inheritance: RoleInheritance;

        inheritance = new RoleInheritance(row.roleId, row.parentId, row.inheritanceId);

        inheritances.push(inheritance)
    }

    return inheritances;
  }

  async findByParentId(id: number): Promise<RoleInheritance[] | undefined> {
    let sql: string;
    let inheritances: RoleInheritance[] = [];
    let sqlResult: any[];

    sql = 'SELECT * FROM role_inheritance WHERE parentId = ?';

    sqlResult = (await this.connection.query(sql, [id]));
    for (let row of sqlResult) {
        let inheritance: RoleInheritance;

        inheritance = new RoleInheritance(row.roleId, row.parentId, row.inheritanceId);

        inheritances.push(inheritance)
    }

    return inheritances;
  }

  async deleteAllByRoleId(roleId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM role_inheritance WHERE roleId = ?';
    try {
      sqlResult = await this.connection.query(sql, [roleId])
    } catch {
      throw new HttpException('Deletion failed', HttpStatus.BAD_REQUEST, {
        description: 'roleInheritances are not deleted'
      });
    }
  }

  async updateAllByRoleId(roleId: number, roles: RoleInheritance[]) {
    await this.deleteAllByRoleId(roleId);
    for (const role of roles) {
      this.save(role)
    }
  }

  async update(roleInheritance: RoleInheritance) {
    let sql: string;
    let sqlResult: any;

    sql = 'UPDATE role_inheritance SET roleId = ?, parentId = ? WHERE inheritanceId = ?';
    sqlResult = await this.connection.query(sql, [roleInheritance.roleId, roleInheritance.parentId, roleInheritance.inheritanceId]);

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      throw new HttpException('Role Inheritance update failed', HttpStatus.BAD_REQUEST , {
        description: 'role inheritance is not edited'
      })
    }
  }

  async delete(roleInheritance: RoleInheritance) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM role_inheritance WHERE inheritanceId = ?';
    try {
      sqlResult = await this.connection.query(sql, [roleInheritance.inheritanceId])
    } catch {
      throw new HttpException('Deletion failed', HttpStatus.BAD_REQUEST, {
        description: 'roleInheritance is not deleted'
      });
    }
  }
}
