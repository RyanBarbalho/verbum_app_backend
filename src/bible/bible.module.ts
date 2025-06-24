import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibleController } from './bible.controller';
import { BookService } from './book.service';
import { ChapterService } from './chapter.service';
import { Book } from './entities/book.entity';
import { Chapter } from './entities/chapter.entity';
import { Verse } from './entities/verse.entity';
import { VerseService } from './verse.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Book, Chapter, Verse])
    ],
    controllers: [BibleController],
    providers: [BookService, ChapterService, VerseService],
    exports: [BookService, ChapterService, VerseService]
})
export class BibleModule {}