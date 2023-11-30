import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@Controller('tenants')
export class TenantsController {
    constructor(private tenantService: TenantsService) {}

    @Get()
    fetchAll() {
        return this.tenantService.findAll()
    }
}
