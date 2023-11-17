import { Controller, Get } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
    constructor(private tenantService: TenantsService) {}

    @Get()
    fetchAll() {
        return this.tenantService.findAll()
    }
}
