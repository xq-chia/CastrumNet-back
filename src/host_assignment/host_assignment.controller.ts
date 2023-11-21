import { Controller, Get } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('hostAssignment')
export class HostAssignmentController {
    constructor(private userService: UsersService) {}
    @Get()
    async fetch() {
        let users: User[];
        let ret: any[] = [];

        users = await this.userService.findAll()
        for (const user of users) {
            ret.push({ userId: user.userId, username: user.username });
        }

        return ret;
    }
}
