import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from 'src/dto/create-users.dto';
import { User } from 'src/entity/user.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    fetchAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() createDto: CreateDto): Promise<boolean> {
        let user: User;

        user = new User(createDto.userId, createDto.username, createDto.password, createDto.firstName, createDto.lastName, createDto.tenantId)
        
        return this.usersService.save(user);
    }
}
