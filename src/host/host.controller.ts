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
    async fetchAll() {
        let hosts: Host[];

        hosts = await this.hostService.findAll();

        return {
            msg: 'Successfully fetched all hosts',
            hosts
        }
    }

    @Get(':hostId')
    async fetch(@Param('hostId') hostId: number) {
        let host: Host;

        host = await this.hostService.findOneByHostId(hostId)

        return {
            msg: `Successfully fetched host ${hostId}`,
            host
        }
    }

    @Post()
    async save(@Body() dto: CreateHostDto) {
        let host: Host;
        let hostId: number;

        host = new Host(dto.host, dto.ipAddress)

        hostId = await this.hostService.save(host);

        return {
            msg: `Successfully created host ${hostId}`
        }
    }

    @Post('testConn')
    async testConn(@Body() dto: TestConnHostDto) {
        let isUp: boolean;

        isUp = await this.hostService.testConn(dto.ipAddress);

        return {
            msg: `SSH connection to ${dto.ipAddress} ${isUp ? 'success' : 'failed' }`,
            isUp
        };
    }

    @Patch(':hostId')
    async edit(@Param('hostId') hostId: number, @Body() dto: EditHostDto) {
        let host: Host;
        
        host = new Host(dto.host, dto.ipAddress, hostId);

        await this.hostService.update(host);

        return {
            msg: `Successfully edited host ${hostId}`
        }
    }

    @Delete(':hostId')
    delete(@Param('hostId') hostId: number) {
        this.hostService.deleteByHostId(hostId);

        return {
            msg: `Successfully deleted host ${hostId}`
        }
    }
}
