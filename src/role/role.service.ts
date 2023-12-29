import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { Role } from 'src/entity/role.entity';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';

@Injectable()
export class RoleService {
    constructor(
      @Inject('DATABASE_CONNECTION') private connection: Connection,
      private roleInheritanceService: RoleInheritanceService
    ) {}

  async save(role: Role): Promise<number> {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO role (role, description) VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [role.role, role.description])

    return sqlResult.insertId;
  }

  async findAllChildByRoleId(roleId: number) {
    let sql: string;
    let sqlResult: any;
    let childRoles: Role[] = []

    let childRoleInheritances: RoleInheritance[];
    childRoleInheritances = await this.roleInheritanceService.findByParentId(roleId);
    for (const childRoleInheritance of childRoleInheritances) {
      let childRole: Role;

      childRole = await this.findOneByRoleId(childRoleInheritance.roleId);
      childRoles.push(childRole);

      let grandchildRoles = await this.findAllChildByRoleId(childRole.roleId);
      childRoles.push(...grandchildRoles)
    }

    return childRoles;
  }

  async update(role: Role) {
    let sql: string;
    let sqlResult: any;

    sql = 'UPDATE role SET role = ?, description = ? WHERE roleId = ?';
    sqlResult = await this.connection.query(sql, [role.role, role.description, role.roleId]);

    if (sqlResult.affectedRows == 1) {
      return true;
    } else {
      throw new HttpException('Role update failed', HttpStatus.BAD_REQUEST , {
        description: 'role is not edited'
      })
    }

  }

  async findAll(): Promise<Role[]> {
    let sql: string;
    let roles: Role[] = [];
    let sqlResult: any;

    sql = 'SELECT * FROM role';

    sqlResult = await this.connection.query(sql);
    for (const row of sqlResult) {
      let role: Role;
      role = new Role(row.role, row.description, row.roleId);
      roles.push(role);
    }

    return roles;
  }

  async findOneByRoleId(roleId: number): Promise<Role | undefined> {
    let sql: string;
    let role: Role;
    let sqlResult: any;

    sql = 'SELECT * FROM role WHERE roleId = ?';

    sqlResult = (await this.connection.query(sql, [roleId]));

    if (sqlResult.length != 0) {
      let row: any;
      row = sqlResult[0];
      role = new Role(row.role, row.description, row.roleId);
    }

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
      throw new HttpException('Deletion failed', HttpStatus.BAD_REQUEST, {
        description: 'role are not deleted'
      });
    }
  }
}