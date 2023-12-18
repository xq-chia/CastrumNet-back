import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';
import { GenericExceptionFilter } from 'src/filter/generic-exception/generic-exception.filter';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@UseFilters(GenericExceptionFilter)
@Controller('tenants')
export class TenantsController {
    constructor(private tenantService: TenantsService) {}

    @Get()
    fetchAll() {
        return this.tenantService.findAll()
    }
}
