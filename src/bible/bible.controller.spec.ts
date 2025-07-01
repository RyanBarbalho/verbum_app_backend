import { Test, TestingModule } from '@nestjs/testing';
import { BibleController } from './bible.controller';
import { BookService } from './book.service';
import { ChapterService } from './chapter.service';
import { Book } from './entities/book.entity';
import { Chapter } from './entities/chapter.entity';
import { Verse } from './entities/verse.entity';
import { VerseService } from './verse.service';

describe('BibleController', () => {
  let controller: BibleController;
  let bookService: BookService;
  let chapterService: ChapterService;
  let verseService: VerseService;

  const mockBook: Book = {
    id: '1',
    name: 'Gênesis',
    abbreviation: 'Gn',
    testament: 'old',
    order: 1,
    description: 'Livro de Gênesis',
    chapters: []
  };

  const mockChapter: Chapter = {
    id: '1',
    number: 1,
    book: mockBook,
    bookId: '1',
    verses: []
  };

  const mockVerse: Verse = {
    id: '1',
    number: 1,
    text: 'No princípio, criou Deus os céus e a terra.',
    chapter: mockChapter,
    chapterId: '1'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibleController],
      providers: [
        {
          provide: BookService,
          useValue: {
            findAllBooks: jest.fn().mockResolvedValue([mockBook]),
            findBookById: jest.fn().mockResolvedValue(mockBook),
            findBookByName: jest.fn().mockResolvedValue(mockBook),
            findBookByAbbreviation: jest.fn().mockResolvedValue(mockBook),
            findByTestament: jest.fn().mockResolvedValue([mockBook]),
            createBook: jest.fn().mockResolvedValue(mockBook),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ChapterService,
          useValue: {
            findChaptersByBook: jest.fn().mockResolvedValue([mockChapter]),
            findChapterById: jest.fn().mockResolvedValue(mockChapter),
            findChapterByBookAndNumber: jest.fn().mockResolvedValue(mockChapter),
            create: jest.fn().mockResolvedValue(mockChapter),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: VerseService,
          useValue: {
            findVersesByChapter: jest.fn().mockResolvedValue([mockVerse]),
            findVerseById: jest.fn().mockResolvedValue(mockVerse),
            findVerseByReference: jest.fn().mockResolvedValue(mockVerse),
            create: jest.fn().mockResolvedValue(mockVerse),
          },
        },
      ],
    }).compile();

    controller = module.get<BibleController>(BibleController);
    bookService = module.get<BookService>(BookService);
    chapterService = module.get<ChapterService>(ChapterService);
    verseService = module.get<VerseService>(VerseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should return an array of books', async () => {
      const result = await controller.getAllBooks();
      expect(result).toEqual([mockBook]);
      expect(bookService.findAllBooks).toHaveBeenCalled();
    });
  });

  describe('getBookById', () => {
    it('should return a book by id', async () => {
      const result = await controller.getBookById('1');
      expect(result).toEqual(mockBook);
      expect(bookService.findBookById).toHaveBeenCalledWith('1');
    });
  });

  describe('getBookByName', () => {
    it('should return a book by name', async () => {
      const result = await controller.getBookByName('Gênesis');
      expect(result).toEqual(mockBook);
      expect(bookService.findBookByName).toHaveBeenCalledWith('Gênesis');
    });
  });

  describe('getBookByAbbreviation', () => {
    it('should return a book by abbreviation', async () => {
      const result = await controller.getBookByAbbreviation('Gn');
      expect(result).toEqual(mockBook);
      expect(bookService.findBookByAbbreviation).toHaveBeenCalledWith('Gn');
    });
  });

  describe('getBooksByTestament', () => {
    it('should return books by testament', async () => {
      const result = await controller.getBooksByTestament('old');
      expect(result).toEqual([mockBook]);
      expect(bookService.findByTestament).toHaveBeenCalledWith('old');
    });
  });

  describe('getChaptersByBook', () => {
    it('should return chapters of a book', async () => {
      const result = await controller.getChaptersByBook('1');
      expect(result).toEqual([mockChapter]);
      expect(chapterService.findChaptersByBook).toHaveBeenCalledWith('1');
    });
  });

  describe('getChapterById', () => {
    it('should return a chapter by id', async () => {
      const result = await controller.getChapterById('1');
      expect(result).toEqual(mockChapter);
      expect(chapterService.findChapterById).toHaveBeenCalledWith('1');
    });
  });

  describe('getVersesByChapter', () => {
    it('should return verses of a chapter', async () => {
      const result = await controller.getVersesByChapter('1');
      expect(result).toEqual([mockVerse]);
      expect(verseService.findVersesByChapter).toHaveBeenCalledWith('1');
    });
  });

  describe('getVerseById', () => {
    it('should return a verse by id', async () => {
      const result = await controller.getVerseById('1');
      expect(result).toEqual(mockVerse);
      expect(verseService.findVerseById).toHaveBeenCalledWith('1');
    });
  });
}); 