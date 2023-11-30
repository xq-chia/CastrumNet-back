import { Body, Controller, Get, Patch, Param, UseInterceptors } from '@nestjs/common';
import { EditRoleAssignmentDto } from 'src/dto/edit-roleAssignment.dto';
import { RoleAssignmentService } from './role_assignment.service';
import { RoleAssignment } from 'src/entity/role_assignment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entity/user.entity';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller('roleAssignment')
export class RoleAssignmentController {
  constructor(
      private roleAssignmentService: RoleAssignmentService,
      private userService: UsersService,
  ) {}

  @Get()
  async fetchAll() {
    let users: User[];
    let ret: any[] = [];

    users = await this.userService.findAll();
    for (const user of users) {
      ret.push({ userId: user.userId, username: user.username });
    }

    return ret;
  }

  @Patch()
  edit(@Body() dto: EditRoleAssignmentDto) {
      for (const roleAssignment of dto.roleAssignments) {
          this.roleAssignmentService.deleteAllByUserHostId(roleAssignment.userHostId)
          for (const roleId of roleAssignment.roleIds) {
              this.roleAssignmentService.save(new RoleAssignment(roleAssignment.userHostId, roleId));
          }
      }
  }
}
