import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class BibleService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,
    ) {}

    //chapter Methods
    async findChaptersByBook(bookId: string): Promise<Chapter[]> {
        return this.chapterRepository.find({
            where:{ bookId},
            order: { number: 'ASC'},
            relations: ['verses']
        });
    }

    async findChapterById(id: string): Promise<Chapter> {
        const chapter = await this.chapterRepository.findOne({
            where: {id},
            relations: ['verses']
        })
        if (!chapter) {
            throw new NotFoundException('chapter with id ${id} not found');
        }
        return chapter;
    }

    async findChapterByBookAndNumber(bookId: string, chapterNumber: number): Promise<Chapter> {
        const chapter = await this.chapterRepository.findOne({
            where: { bookId, number: chapterNumber },
            relations: ['book', 'verses']
        });
        if (!chapter) {
            throw new NotFoundException('chapter with bookId ${id} and number ${chapterNumber} not found');
        }
        return chapter;
    }
}
