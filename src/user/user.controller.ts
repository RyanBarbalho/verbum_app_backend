import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { StreakService } from 'src/streak/streak.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly streakService: StreakService
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        try {
            return await this.userService.find(id);
        } catch (error) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email:  string): Promise<User> {
        return this.userService.findByEmail(email);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
        try {
            await this.userService.deleteUser(id);
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get(':userId/streak')
    async getStreak(@Param('userId') id: string) {
        return this.userService.getStreak(id);
    }

    //sempre que o usuario realizar uma atividade, será chamado
    @Post(':id/streak/increment')
    async incrementStreak(@Param('id') id: string) {
        return this.userService.incrementStreak(id);
    }

}