import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/entity/role.entity';
import { CreateRoleDto } from 'src/dto/create-role.dto';

@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService) {}

    @Get()
    async fetchAll(): Promise<Role[]> {
        return await this.roleService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateRoleDto): Promise<boolean> {
        let role: Role;

        role = new Role(dto.roleId, dto.role, dto.description)

        return await this.roleService.save(role);
    }
}
