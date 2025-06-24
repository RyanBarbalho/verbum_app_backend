import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BibleService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) {}

    //book methods

    //will fetch all books ordered by their number param
    async findAllBooks(): Promise<Book[]> {
        return this.bookRepository.find({
            order: { number: 'ASC'}
        })
    }

    async findBookById(id: string): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['chapters']
        });
        if (!book) {
            throw new NotFoundException('Book with id ${id} not found');
        }
        return book;
    }

    async findBookByAbbreviation(abbreviation: string): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: {abbreviation},
            relations: ['chapters']
        });
        if (!book) {
            throw new NotFoundException('Book with abbreviation ${abbreviation} not found');
        }
        return book;
    }
}
