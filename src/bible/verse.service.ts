import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVerseDto } from './dto/verse.dto';
import { Verse } from './entities/verse.entity';

@Injectable()
export class VerseService {
    constructor(
        @InjectRepository(Verse)
        private verseRepository: Repository<Verse>,
    ) {}

    // Create methods
    async create(dto: CreateVerseDto): Promise<Verse> {
        const verse = this.verseRepository.create(dto);
        return this.verseRepository.save(verse);
    }

    async findVersesByChapter(chapterId: string): Promise<Verse[]> {
        return this.verseRepository.find({
            where: { chapterId },
            order: { number: 'ASC' }
        });
    }

    async findVerseById(id: string): Promise<Verse> {
        const verse = await this.verseRepository.findOne({
            where: { id },
            relations: ['chapter', 'chapter.book']
        });
        if (!verse) {
            throw new NotFoundException(`Verse with ID ${id} not found`);
        }
        return verse;
    }

    async findVerseByReference(bookId: string, chapterNumber: number, verseNumber: number): Promise<Verse> {
        const verse = await this.verseRepository
            .createQueryBuilder('verse')
            .leftJoinAndSelect('verse.chapter', 'chapter')
            .leftJoinAndSelect('chapter.book', 'book')
            .where('chapter.bookId = :bookId', { bookId })
            .andWhere('chapter.number = :chapterNumber', { chapterNumber })
            .andWhere('verse.number = :verseNumber', { verseNumber })
            .getOne();

        if (!verse) {
            throw new NotFoundException(`Verse ${verseNumber} not found in ${bookId} chapter ${chapterNumber}`);
        }
        return verse;
    }

    // Search methods
    async searchVerses(query: string): Promise<Verse[]> {
        return this.verseRepository
            .createQueryBuilder('verse')
            .leftJoinAndSelect('verse.chapter', 'chapter')
            .leftJoinAndSelect('chapter.book', 'book')
            .where('verse.text ILIKE :query', { query: `%${query}%` })
            .orderBy('book.order', 'ASC')
            .addOrderBy('chapter.number', 'ASC')
            .addOrderBy('verse.number', 'ASC')
            .getMany();
    }
}
