import { Body, Controller, Patch } from '@nestjs/common';
import { EditRoleAssignmentDto } from 'src/dto/edit-roleAssignment.dto';
import { RoleAssignmentService } from './role_assignment.service';
import { RoleAssignment } from 'src/entity/role_assignment.entity';

@Controller('roleAssignment')
export class RoleAssignmentController {

    constructor(private roleAssignmentService: RoleAssignmentService) {}

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
