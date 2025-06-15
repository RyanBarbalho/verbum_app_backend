import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('streaks')
export class Streak {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'current_streak', default: 0})
    currentStreak: number;

    @Column({name: 'longest_streak', default: 0})
    longestStreak: number;

    @Column({name: 'last_activity', type: 'date', nullable: true})
    lastActivity: Date | null;

    @OneToOne(() => User, user => user.streak)
    user: User;
}