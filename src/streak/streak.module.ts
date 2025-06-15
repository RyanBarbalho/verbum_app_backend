import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Streak } from './entities/streak.entity';
import { StreakService } from './streak.service';

@Module({
    imports: [TypeOrmModule.forFeature([Streak])],
    providers: [StreakService],
    exports: [StreakService]
})
export class StreakModule {}