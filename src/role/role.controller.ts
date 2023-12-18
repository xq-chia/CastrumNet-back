import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/entity/role.entity';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';
import { PermissionService } from 'src/permission/permission.service';
import { Permission } from 'src/entity/permission.entity';
import { EditRoleDto } from 'src/dto/edit-role.dto';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';
import { FileService } from 'src/file/file.service';
import { File } from 'src/entity/file.entity';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('role')
export class RoleController {
    constructor(
        private roleService: RoleService,
        private roleInheritanceService: RoleInheritanceService,
        private permissionService: PermissionService,
        private fileService: FileService
    ) {}

    @Get()
    async fetchAll(): Promise<any> {
        let roles: Role[];

        roles = await this.roleService.findAll();

        return {
            msg: 'Successfully fetched all roles',
            roles
        }
    }

    @Get(':roleId')
    async fetch(@Param('roleId') roleId: number) {
        let role: Role;
        let roleInheritances: RoleInheritance[];
        let permissions: Permission[];
        let parentRoles: Role[] = [];
        let files: File[] = [];

        role = await this.roleService.findOneByRoleId(roleId);
        roleInheritances = await this.roleInheritanceService.findByRoleId(roleId);
        permissions = await this.permissionService.findAllByRoleId(roleId);
        files = await this.fileService.findAllByRoleId(roleId);

        for (const roleInheritance of roleInheritances) {
            parentRoles.push(await this.roleService.findOneByRoleId(roleInheritance.parentId))
        }

        return {
            msg: `Successfully fetched role ${roleId}`,
            roleId,
            role: role.role,
            description: role.description,
            parentRoles,
            permissions,
            files
        }
    }

    @Delete(':roleId')
    async delete(@Param('roleId') roleId: number) {
        await this.roleInheritanceService.deleteAllByRoleId(roleId);
        await this.permissionService.deleteAllByRoleId(roleId);
        await this.roleService.deleteByRoleId(roleId);

        return {
            msg: `Successfully deleted role ${roleId}`
        }
    }

    @Post()
    async create(@Body() dto: CreateRoleDto): Promise<any> {
        let role: Role;
        let roleId: number;

        role = new Role(dto.role, dto.description)

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
            this.permissionService.save(new Permission(permission.object, permission.allow, roleId));
        }

        if (dto.files.length != 0) {
            for (const file of dto.files) {
                this.fileService.save(new File(file.path, roleId));
            }
        }

        return {
            msg: `Successfully created role ${roleId}`
        }
    }
    
    @Patch(':roleId')
    async edit(@Param('roleId') roleId: number, @Body() dto: EditRoleDto) {
        let role: Role;
        let parents: RoleInheritance[] = [];
        let permissions: Permission[] = [];

        role = new Role(dto.role, dto.description, dto.roleId)

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
            permissions.push(new Permission(permission.object, !!permission.allow, dto.roleId));
        }
        this.permissionService.updateAllByRoleId(roleId, permissions)

        return {
            msg: `Successfully edited role ${roleId}`
        }
    }
}
