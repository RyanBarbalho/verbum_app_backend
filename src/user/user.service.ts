import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Streak } from "src/streak/entities/streak.entity";
import { StreakService } from "src/streak/streak.service";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private streakService: StreakService
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async find(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {id},
            relations: ['streak']//faz com que pegue o streak data junto com o userdata
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}});
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async editUser(id: string, updateData: Partial<User>): Promise<User> {
        const result = await this.userRepository.update(id,updateData);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
        const updatedUser = await this.userRepository.findOne({where: {id}});
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('User not found');
        }
    }

    async getStreak(id: string): Promise<Streak> {
        const user = await this.find(id);
        return user.streak;
    }

    async incrementStreak(id: string): Promise<Streak> {
        const user = await this.find(id);
        if (!user.streak) {
            throw new Error('User has no streak');
        }
        return this.streakService.incrementStreak(user.streak.id);
    }
}
