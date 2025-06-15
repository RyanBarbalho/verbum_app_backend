import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateStreakDto } from './dto/streak.dto';
import { Streak } from './entities/streak.entity';

@Injectable()
export class StreakService {
    constructor(
        @InjectRepository(Streak)
        private streakRepository: Repository<Streak>
    ) {}

    async createStreak(): Promise<Streak> {
        const streak = this.streakRepository.create({
            currentStreak: 0,
            longestStreak: 0,
            lastActivity: null,
        })
        return this.streakRepository.save(streak);
    }

    async updateStreak(updateStreakDto: UpdateStreakDto, id: string): Promise<Streak> {
        await this.streakRepository.update(id, updateStreakDto);
        const updatedStreak = await this.streakRepository.findOne({ where: {id}});
        if (!updatedStreak) {
            throw new Error('Streak not found');
        }
        return updatedStreak;
    }

    private isConsecutiveDay(lastActivity: Date, today: Date): boolean {
        const last = new Date(lastActivity.setHours(0, 0, 0, 0));
        const current = new Date(today.setHours(0, 0, 0, 0));
        const diffTime = current.getTime() - last.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    private isSameDay(date1: Date, date2: Date): boolean {
        return date1.toDateString() === date2.toDateString();
    }

    //sempre que o usuario realizar uma atividade, será chamado
    async incrementStreak(streakId: string): Promise<Streak> {
        const streak = await this.streakRepository.findOne({ where: {id: streakId}});
        if (!streak) {
            throw new Error('Streak not found');
        }

        const today = new Date();
        const lastActivity = streak.lastActivity ? new Date(streak.lastActivity) : null;

        //se ja foi incrementado hoje, pula
        if (lastActivity && this.isSameDay(lastActivity, today)) {
            return streak;
        }

        //primeiro verifica se é null, se for, é pq é o primeiro acesso do usuario
        if (lastActivity === null) {
            streak.lastActivity = today;
            streak.currentStreak = streak.currentStreak + 1;
        }//se for um dia consecutivo, vai upar a streak
        else if (this.isConsecutiveDay(lastActivity, today)) {
            streak.lastActivity = today
            streak.currentStreak += 1;
        }
        else {
            streak.lastActivity = today
            streak.currentStreak = 1;
        }

        if (streak.longestStreak < streak.currentStreak) {
            streak.longestStreak = streak.currentStreak;
        }
        return this.streakRepository.save(streak);
    }


}