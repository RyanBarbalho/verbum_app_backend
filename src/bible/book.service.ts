import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) {}

    //book methods

    async createBook(dto: CreateBookDto): Promise<Book> {
        const book = this.bookRepository.create(dto);
        return this.bookRepository.save(book);
    }

    async delete(id: string): Promise<void> {
        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Book with id ${id} not found`);
        }
    }

    //will fetch all books ordered by their number param
    async findAllBooks(): Promise<Book[]> {
        return this.bookRepository.find({
            order: { order: 'ASC'},
            relations: ['chapters']
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

    async findBookByName(name: string): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: {name},
            relations: ['chapters']
        });
        if (!book) {
            throw new NotFoundException('Book with name ${name} not found');
        }
        return book;
    }

    async findByTestament(testament: 'old' | 'new'): Promise<Book[]> {
        return this.bookRepository.find({
            where: {testament},
            order: {order: 'ASC'},
            relations: ['chapters']
        });
    }
}
