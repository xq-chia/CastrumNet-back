import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Connection } from 'mariadb';
import { RoleAssignment } from 'src/entity/role_assignment.entity';

@Injectable()
export class RoleAssignmentService {
    constructor(@Inject('DATABASE_CONNECTION') private connection: Connection) {}

  async save(roleAssignment: RoleAssignment): Promise<boolean> {
    let sql: string;
    let sqlResult: any;

    sql = 'INSERT INTO role_assignment (userHostId, roleId) VALUES (?, ?)';
    sqlResult = await this.connection.query(sql, [roleAssignment.userHostId, roleAssignment.roleId])

    return sqlResult.insertId
  }

  async findAllByUserHostId(userHostId: number): Promise<RoleAssignment[]> {
    let sql: string;
    let sqlResult: any;
    let roleAssignments: RoleAssignment[] = [];

    sql = "SELECT * FROM role_assignment WHERE userHostId = ?";

    sqlResult = (await this.connection.query(sql, [userHostId]));

    for (const row of sqlResult) {
      let roleAssignment: RoleAssignment;

      roleAssignment = new RoleAssignment(row.userHostId, row.roleId);

      roleAssignments.push(roleAssignment)
    }

    return roleAssignments;
  }

  async deleteAllByUserHostId(userHostId: number) {
    let sql: string;
    let sqlResult: any;

    sql = 'DELETE FROM role_assignment WHERE userHostId = ?';
    sqlResult = await this.connection.query(sql, [userHostId])

    if (sqlResult.affectedRows >= 1) {
      return true;
    } else {
      throw new HttpException('Deletion failed', HttpStatus.BAD_REQUEST, {
        description: 'role assignments are not deleted'
      });
    }
  }
}
