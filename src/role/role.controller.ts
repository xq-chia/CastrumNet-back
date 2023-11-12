import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/entity/role.entity';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';
import { PermissionService } from 'src/permission/permission.service';
import { Permission } from 'src/entity/permission.entity';

@Controller('role')
export class RoleController {
    constructor(
        private roleService: RoleService,
        private roleInheritanceService: RoleInheritanceService,
        private permissionService: PermissionService
    ) {}

    @Get()
    async fetchAll(): Promise<Role[]> {
        return await this.roleService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateRoleDto): Promise<boolean> {
        let role: Role;
        let roleId: number;

        role = new Role(dto.roleId, dto.role, dto.description)

        roleId = await this.roleService.save(role);

        if (dto.parentIds) {
            for (const parentId of dto.parentIds) {
                this.roleInheritanceService.save(new RoleInheritance(roleId, parentId));
            }
        }

        for (const permission of dto.permissions) {
            let rule: number;
            if (!permission.allow) {
                permission.allow = false;
            }
            this.permissionService.save(new Permission(permission.permId, permission.object, permission.allow, roleId));
        }

        return true;
    }
}
