import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { Role } from 'src/entity/role.entity';

@Injectable()
export class RoleService {
    constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async findAll(): Promise<Role[]> {
    let sql: string;
    let roles: Role[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM role';

    sqlResult = await this.connection.query(sql);
    sqlResult.forEach(row => {
      let role: Role;

      role = new Role(row.roleId, row.role, row.description, row.parentId);

      roles.push(role);
    });

    return roles;
  }

}
