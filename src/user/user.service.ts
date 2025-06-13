import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async find(id: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {id}});
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {email}});
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async editUser(id: string, updateData: Partial<User>): Promise<User> {
        const result = await this.userRepository.update(id,updateData);
        if (result.affected === 0) {
            throw new Error('User not found');
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
}
