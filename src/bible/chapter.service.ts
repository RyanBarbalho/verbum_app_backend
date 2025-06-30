import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChapterDto } from './dto/chapter.dto';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepository: Repository<Chapter>,
    ) {}

    async create(dto: CreateChapterDto): Promise<Chapter> {
        const chapter = this.chapterRepository.create(dto);
        return this.chapterRepository.save(chapter);
    }

    async delete(id: string): Promise<void> {
        const result = await this.chapterRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Chapter with id ${id} not found`);
        }
    }

    //finds All chapters from certain book
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
