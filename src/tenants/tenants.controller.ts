import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller('tenants')
export class TenantsController {
    constructor(private tenantService: TenantsService) {}

    @Get()
    fetchAll() {
        return this.tenantService.findAll()
    }
}
