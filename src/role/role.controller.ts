import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/entity/role.entity';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';
import { PermissionService } from 'src/permission/permission.service';
import { Permission } from 'src/entity/permission.entity';
import { EditRoleDto } from 'src/dto/edit-role.dto';

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

    @Get(':roleId')
    async fetch(@Param('roleId') roleId: number) {
        let role: Role;
        let roleInheritances: RoleInheritance[];
        let permissions: Permission[];
        let ret: any;

        role = await this.roleService.findOneByRoleId(roleId);
        roleInheritances = await this.roleInheritanceService.findByRoleId(roleId);
        permissions = await this.permissionService.findAllByRoleId(roleId);

        ret = {
            roleId: role.roleId,
            role: role.role,
            description: role.description,
            parentRoles: [],
            permissions: permissions
        }

        for (const roleInheritance of roleInheritances) {
            ret.parentRoles.push(await this.roleService.findOneByRoleId(roleInheritance.parentId))
        }

        return ret;
    }

    @Delete(':roleId')
    async delete(@Param('roleId') roleId: number) {
        await this.roleInheritanceService.deleteAllByRoleId(roleId);
        await this.permissionService.deleteAllByRoleId(roleId);
        await this.roleService.deleteByRoleId(roleId);
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
            if (!permission.allow) {
                permission.allow = false;
            }
            this.permissionService.save(new Permission(permission.permId, permission.object, permission.allow, roleId));
        }

        return true;
    }
    
    @Patch(':roleId')
    async edit(@Param('roleId') roleId: number, @Body() dto: EditRoleDto) {
        let role: Role;
        let parents: RoleInheritance[] = [];
        let permissions: Permission[] = [];

        role = new Role(roleId, dto.role, dto.description)

        this.roleService.update(role);

        if(dto.parentIds) {
            for (const parentId of dto.parentIds) {
                parents.push(new RoleInheritance(roleId, parentId));
            }
            this.roleInheritanceService.updateAllByRoleId(roleId, parents);
        } else {
            this.roleInheritanceService.deleteAllByRoleId(roleId);
        }

        for (const permission of dto.permissions) {
            if (!permission.allow) {
                permission.allow = false;
            }
            permissions.push(new Permission(permission.permId, permission.object, permission.allow, dto.roleId));
        }
        this.permissionService.updateAllByRoleId(roleId, permissions)
    }
}
