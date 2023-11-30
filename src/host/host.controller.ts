import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { HostService } from './host.service';
import { CreateHostDto } from 'src/dto/create-host.dto';
import { Host } from 'src/entity/host.entity';
import { TestConnHostDto } from 'src/dto/testConn-host.dto';
import { EditHostDto } from 'src/dto/edit-host.dto';
import { TransformInterceptor } from 'src/interceptor/transform/transform.interceptor';
import { AccountingInterceptor } from 'src/interceptor/accounting/accounting.interceptor';

@UseInterceptors(AccountingInterceptor, TransformInterceptor)
@Controller('host')
export class HostController {
    constructor(private hostService: HostService) {}

    @Get()
    fetchAll() {
        return this.hostService.findAll()
    }

    @Get(':hostId')
    fetch(@Param('hostId') hostId: number) {
        return this.hostService.findOneByHostId(hostId);
    }

    @Post()
    async save(@Body() dto: CreateHostDto) {
        let host: Host;

        host = new Host(dto.host, dto.ipAddress)

        await this.hostService.save(host);
    }

    @Post('testConn')
    async testConn(@Body() dto: TestConnHostDto) {
        return { isUp: await this.hostService.testConn(dto.ipAddress) };
    }

    @Patch(':hostId')
    async edit(@Param('hostId') hostId: number, @Body() dto: EditHostDto) {
        let host: Host;
        
        host = new Host(dto.host, dto.ipAddress, hostId);

        await this.hostService.update(host);
    }

    @Delete(':hostId')
    delete(@Param('hostId') hostId: number) {
        this.hostService.deleteByHostId(hostId);
    }
}
