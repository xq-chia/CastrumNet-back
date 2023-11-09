import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/entity/role.entity';

@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService) {}

    @Get()
    async fetchAll(): Promise<Role[]> {
        return await this.roleService.findAll();
    }
}
