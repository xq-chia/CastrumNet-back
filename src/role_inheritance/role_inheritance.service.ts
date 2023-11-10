import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { Role } from 'src/entity/role.entity';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';

@Injectable()
export class RoleInheritanceService {
    constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(role: RoleInheritance) {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO role_inheritance VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [role.roleId, role.parentId])

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      return false;
    }
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
}
