import { Body, Controller, Get, Post } from '@nestjs/common';
import { HostService } from './host.service';
import { CreateHostDto } from 'src/dto/create-host.dto';
import { Host } from 'src/entity/host.entity';

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

        host = new Host(0, dto.host, dto.ipAddress)

        await this.hostService.save(host);
    }
}
