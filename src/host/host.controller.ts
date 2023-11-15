import { Controller, Get } from '@nestjs/common';
import { HostService } from './host.service';

@Controller('host')
export class HostController {
    constructor(private hostService: HostService) {}

    @Get()
    fetchAll() {
        return this.hostService.findAll()
    }
}
