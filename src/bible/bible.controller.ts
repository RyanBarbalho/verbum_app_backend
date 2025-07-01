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

    // POST https://localhost:3000/bible/books
    // Creates a new book in the Bible database
    @Post('books')
    async createBook(@Body() dto: CreateBookDto): Promise<Book> {
        try {
            return await this.bookService.createBook(dto);
        } catch (error) {
            throw new HttpException('Failed to create book', HttpStatus.BAD_REQUEST);
        }
    }

    // GET https://localhost:3000/bible/books
    // Retrieves all books from the Bible database
    @Get('books')
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAllBooks();
    }

    // GET https://localhost:3000/bible/books/:id
    // Retrieves a specific book by its unique identifier
    @Get('books/:id')
    async getBookById(@Param('id') id: string): Promise<Book> {
        try {
            return await this.bookService.findBookById(id);
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    // GET https://localhost:3000/bible/books/abbreviation/:abbreviation
    // Retrieves a book by its abbreviation (e.g., "Gen" for Genesis)
    @Get('books/abbreviation/:abbreviation')
    async getBookByAbbreviation(@Param('abbreviation') abbreviation: string): Promise<Book> {
        try {
            return await this.bookService.findBookByAbbreviation(abbreviation);
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    // GET https://localhost:3000/bible/books/name/:name
    // Retrieves a book by its full name (e.g., "Genesis", "Matthew")
    @Get('books/name/:name')
    async getBookByName(@Param('name') name: string): Promise<Book> {
        try {
            // Decode the URL-encoded parameter
            const decodedName = decodeURIComponent(name);
            return await this.bookService.findBookByName(decodedName);
        } catch (error) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }

    // GET https://localhost:3000/bible/books/testament/:testament
    // Retrieves all books from a specific testament ("old" or "new")
    @Get('books/testament/:testament')
    async getBooksByTestament(@Param('testament') testament: 'old' | 'new'): Promise<Book[]> {
        return this.bookService.findByTestament(testament);
    }

    // DELETE https://localhost:3000/bible/books/:id
    // Deletes a book from the database by its ID
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

    // POST https://localhost:3000/bible/chapters
    // Creates a new chapter for a specific book
    @Post('chapters')
    async createChapter(@Body() dto: CreateChapterDto): Promise<Chapter> {
        try {
            return await this.chapterService.create(dto);
        } catch (error) {
            throw new HttpException('Failed to create chapter', HttpStatus.BAD_REQUEST);
        }
    }

    // GET https://localhost:3000/bible/books/:bookId/chapters
    // Retrieves all chapters for a specific book
    @Get('books/:bookId/chapters')
    async getChaptersByBook(@Param('bookId') bookId: string): Promise<Chapter[]> {
        return this.chapterService.findChaptersByBook(bookId);
    }

    // GET https://localhost:3000/bible/chapters/:id
    // Retrieves a specific chapter by its unique identifier
    @Get('chapters/:id')
    async getChapterById(@Param('id') id: string): Promise<Chapter> {
        try {
            return await this.chapterService.findChapterById(id);
        } catch (error) {
            throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
        }
    }

    // GET https://localhost:3000/bible/books/:bookId/chapters/:chapterNumber
    // Retrieves a specific chapter by book ID and chapter number
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

    // DELETE https://localhost:3000/bible/chapters/:id
    // Deletes a chapter from the database by its ID
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

    // POST https://localhost:3000/bible/verses
    // Creates a new verse for a specific chapter
    @Post('verses')
    async createVerse(@Body() dto: CreateVerseDto): Promise<Verse> {
        try {
            return await this.verseService.create(dto);
        } catch (error) {
            throw new HttpException('Failed to create verse', HttpStatus.BAD_REQUEST);
        }
    }

    // GET https://localhost:3000/bible/chapters/:chapterId/verses
    // Retrieves all verses for a specific chapter
    @Get('chapters/:chapterId/verses')
    async getVersesByChapter(@Param('chapterId') chapterId: string): Promise<Verse[]> {
        return this.verseService.findVersesByChapter(chapterId);
    }

    // GET https://localhost:3000/bible/verses/:id
    // Retrieves a specific verse by its unique identifier
    @Get('verses/:id')
    async getVerseById(@Param('id') id: string): Promise<Verse> {
        try {
            return await this.verseService.findVerseById(id);
        } catch (error) {
            throw new HttpException('Verse not found', HttpStatus.NOT_FOUND);
        }
    }

    // GET https://localhost:3000/bible/books/:bookId/chapters/:chapterNumber/verses/:verseNumber
    // Retrieves a specific verse by book ID, chapter number, and verse number
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

    // GET https://localhost:3000/bible/search?q=:query
    // Searches for verses containing the specified text in their content
    @Get('search')
    async searchVerses(@Query('q') query: string): Promise<Verse[]> {
        if (!query) {
            throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
        }
        return this.verseService.searchVerses(query);
    }

    // ==================== HIERARCHICAL ENDPOINTS ====================

    // GET https://localhost:3000/bible/books/:bookId/full
    // Retrieves a complete book with all its chapters and verses in a hierarchical structure
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

    // GET https://localhost:3000/bible/books/:bookId/chapters/:chapterNumber/full
    // Retrieves a complete chapter with all its verses for a specific book and chapter number
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