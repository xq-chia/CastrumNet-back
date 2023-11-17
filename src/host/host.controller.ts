import { Body, Controller, Get, Post } from '@nestjs/common';
import { HostService } from './host.service';
import { CreateHostDto } from 'src/dto/create-host.dto';
import { Host } from 'src/entity/host.entity';
import { TestConnHostDto } from 'src/dto/testConn-host.dto';

@Controller('host')
export class HostController {
    constructor(private hostService: HostService) {}

    @Get()
    fetchAll() {
        return this.hostService.findAll()
    }

    @Post()
    async save(@Body() dto: CreateHostDto) {
        let host: Host;

        host = new Host(dto.host, dto.ipAddress)

        await this.hostService.save(host);
    }

    @Post('testConn')
    async testConn(@Body() dto: TestConnHostDto) {
        return await this.hostService.testConn(dto.ipAddress);
    }
}
