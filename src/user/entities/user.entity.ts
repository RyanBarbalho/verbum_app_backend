import { Streak } from 'src/streak/entities/streak.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    avatarUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Streak, {cascade: true})
    @JoinColumn()
    streak: Streak;
}