import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/entity/role.entity';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { RoleInheritanceService } from 'src/role_inheritance/role_inheritance.service';
import { RoleInheritance } from 'src/entity/role_inheritance.entity';

@Controller('role')
export class RoleController {
    constructor(
        private roleService: RoleService,
        private roleInheritanceService: RoleInheritanceService,
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

        for (const parentId of dto.parentIds) {
            let inheritance: RoleInheritance;

            inheritance = new RoleInheritance(roleId, parentId);

            this.roleInheritanceService.save(inheritance);
        }

        return true;
    }
}
