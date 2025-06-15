import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateStreakDto {
    @IsOptional()
    @IsNumber()
    currentStreak?: number;

    @IsOptional()
    @IsNumber()
    longestStreak?: number;

    @IsOptional()
    @IsDate()
    lastActivity?: Date;
}