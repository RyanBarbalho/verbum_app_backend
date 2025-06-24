import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { BookService } from "./book.service";
import { ChapterService } from "./chapter.service";
import { CreateBookDto } from "./dto/book.dto";
import { CreateChapterDto } from "./dto/chapter.dto";
import { CreateVerseDto } from "./dto/verse.dto";
import { Book } from "./entities/book.entity";
import { Chapter } from "./entities/chapter.entity";
import { Verse } from "./entities/verse.entity";
import { VerseService } from "./verse.service";

@Controller('bible')
export class BibleController {
    constructor(
        private readonly bookService: BookService,
        private readonly chapterService: ChapterService,
        private readonly verseService: VerseService
    ) {}

    // ==================== BOOK ENDPOINTS ====================

    @Post('books')
    async createBook(@Body() dto: CreateBookDto): Promise<Book> {
        try {
            return await this.bookService.createBook(dto);
        } catch (error) {
            throw new HttpException('Failed to create book', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('books')
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAllBooks();
    }

    @Get('books/:id')
    async getBookById(@Param('id') id: string): Promise<Book> {
        try {
            return await this.bookService.findBookById(id);
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('books/abbreviation/:abbreviation')
    async getBookByAbbreviation(@Param('abbreviation') abbreviation: string): Promise<Book> {
        try {
            return await this.bookService.findBookByAbbreviation(abbreviation);
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('books/name/:name')
    async getBookByName(@Param('name') name: string): Promise<Book> {
        try {
            return await this.bookService.findBookByName(name);
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('books/testament/:testament')
    async getBooksByTestament(@Param('testament') testament: 'old' | 'new'): Promise<Book[]> {
        return this.bookService.findByTestament(testament);
    }

    @Delete('books/:id')
    async deleteBook(@Param('id') id: string): Promise<{ message: string }> {
        try {
            await this.bookService.delete(id);
            return { message: 'Book deleted successfully' };
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    // ==================== CHAPTER ENDPOINTS ====================

    @Post('chapters')
    async createChapter(@Body() dto: CreateChapterDto): Promise<Chapter> {
        try {
            return await this.chapterService.create(dto);
        } catch (error) {
            throw new HttpException('Failed to create chapter', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('books/:bookId/chapters')
    async getChaptersByBook(@Param('bookId') bookId: string): Promise<Chapter[]> {
        return this.chapterService.findChaptersByBook(bookId);
    }

    @Get('chapters/:id')
    async getChapterById(@Param('id') id: string): Promise<Chapter> {
        try {
            return await this.chapterService.findChapterById(id);
        } catch (error) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('books/:bookId/chapters/:chapterNumber')
    async getChapterByBookAndNumber(
        @Param('bookId') bookId: string,
        @Param('chapterNumber') chapterNumber: number
    ): Promise<Chapter> {
        try {
            return await this.chapterService.findChapterByBookAndNumber(bookId, chapterNumber);
        } catch (error) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
    }

    @Delete('chapters/:id')
    async deleteChapter(@Param('id') id: string): Promise<{ message: string }> {
        try {
            await this.chapterService.delete(id);
            return { message: 'Chapter deleted successfully' };
        } catch (error) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
    }

    // ==================== VERSE ENDPOINTS ====================

    @Post('verses')
    async createVerse(@Body() dto: CreateVerseDto): Promise<Verse> {
        try {
            return await this.verseService.create(dto);
        } catch (error) {
            throw new HttpException('Failed to create verse', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('chapters/:chapterId/verses')
    async getVersesByChapter(@Param('chapterId') chapterId: string): Promise<Verse[]> {
        return this.verseService.findVersesByChapter(chapterId);
    }

    @Get('verses/:id')
    async getVerseById(@Param('id') id: string): Promise<Verse> {
        try {
            return await this.verseService.findVerseById(id);
        } catch (error) {
            throw new HttpException('Verse not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('books/:bookId/chapters/:chapterNumber/verses/:verseNumber')
    async getVerseByReference(
        @Param('bookId') bookId: string,
        @Param('chapterNumber') chapterNumber: number,
        @Param('verseNumber') verseNumber: number
    ): Promise<Verse> {
        try {
            return await this.verseService.findVerseByReference(bookId, chapterNumber, verseNumber);
        } catch (error) {
            throw new HttpException('Verse not found', HttpStatus.NOT_FOUND);
        }
    }

    // ==================== SEARCH ENDPOINTS ====================

    @Get('search')
    async searchVerses(@Query('q') query: string): Promise<Verse[]> {
        if (!query) {
            throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
        }
        return this.verseService.searchVerses(query);
    }

    // ==================== HIERARCHICAL ENDPOINTS ====================

    @Get('books/:bookId/full')
    async getBookWithChaptersAndVerses(@Param('bookId') bookId: string): Promise<Book> {
        try {
            const book = await this.bookService.findBookById(bookId);
            const chapters = await this.chapterService.findChaptersByBook(bookId);

            // Load verses for each chapter
            for (const chapter of chapters) {
                chapter.verses = await this.verseService.findVersesByChapter(chapter.id);
            }

            book.chapters = chapters;
            return book;
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get('books/:bookId/chapters/:chapterNumber/full')
    async getChapterWithVerses(
        @Param('bookId') bookId: string,
        @Param('chapterNumber') chapterNumber: number
    ): Promise<Chapter> {
        try {
            return await this.chapterService.findChapterByBookAndNumber(bookId, chapterNumber);
        } catch (error) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
    }
}