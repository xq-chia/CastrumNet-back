import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';

@Injectable()
export class RoleInheritanceService {
    constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(role: RoleInheritance) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO role_inheritance VALUES (?, ?)';
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

        inheritance = new RoleInheritance(row.roleId, row.parentId);

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
}
