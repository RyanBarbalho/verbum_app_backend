import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { CreateBookDto } from 'src/bible/dto/book.dto';
import { CreateChapterDto } from 'src/bible/dto/chapter.dto';
import { CreateVerseDto } from 'src/bible/dto/verse.dto';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { BookService } from '../../bible/book.service';
import { ChapterService } from '../../bible/chapter.service';
import { VerseService } from '../../bible/verse.service';
import { handleAbbreviation, handleDescription } from './util';

async function seedBible() {
    let app;
    try {
        app = await NestFactory.createApplicationContext(AppModule);
        console.log('Iniciando seed da Bíblia...');

        // Try reading the JSON file directly
        const jsonPath = path.join(__dirname, 'bible-data.json');

        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        const bibleData = JSON.parse(jsonContent);
        console.log('Bible data loaded successfully');
        console.log('Keys in bibleData:', Object.keys(bibleData));

        const bookService = app.get(BookService);
        const chapterService = app.get(ChapterService);
        const verseService = app.get(VerseService);

        // logic wrapped in db transaction for atomicity (all-or-nothing execution)
        await app.get(DataSource).transaction(async manager => {
            for( const key in bibleData) {
                //we're iterating through the testaments (2)

                const testamentBooks = bibleData[key];
                const bookKeys = Object.keys(testamentBooks);

                console.log(`Processing books from testamnet: `,key);
                for (let i = 0; i < bookKeys.length; i++) {
                    const bookKey = bookKeys[i]
                    const book = bibleData[key][bookKey]
                    const dto = new CreateBookDto();
                    dto.name = book.nome;
                    dto.abbreviation = handleAbbreviation(book.nome);
                    dto.testament = key === "antigoTestamento" ? "old" : "new";
                    dto.order = i + 1;
                    dto.description = handleDescription(book.nome);
                    let bookCreated;
                    try{
                        bookCreated = await bookService.createBook(dto);
                        console.log('✔ Created book: ', book.nome);
                    } catch (error) {
                        console.error('❌ failed to create book: ', book.nome, '. error: ', error.message);
                        throw error;
                    }
                    if(i % 10 === 0) {
                        console.clear();
                        console.log('Progress: ', i,' of ',bookKeys.length, ' books processed')
                    }

                    if (!bookCreated) {
                        console.error('Skipping chapters for failed book:', book.nome);
                        continue;
                    }

                    //iterate through the chapters of each book
                    // const chapters
                    const chapters = book.capitulos;
                    const chapterKeys = Object.keys(chapters)
                    console.log(`Processing ${chapterKeys.length} chapters for book: ${book.nome}`);
                    for (let j = 0; j < chapterKeys.length; j++) {
                        const bookId = bookCreated.id;
                        const chapterKey = chapterKeys[j];
                        const chapter = chapters[chapterKey];
                        const dto = new CreateChapterDto();
                        dto.number = chapter.capitulo;
                        dto.bookId = bookId;
                        let chapterCreated;
                        try{
                            chapterCreated = await chapterService.create(dto);
                            console.log(`✔ Created chapter ${chapter.capitulo} for book: ${book.nome}`);
                        } catch (error) {
                            console.error('❌ failed to create chapter: ', chapter.capitulo, '. error: ', error.message);
                            throw error;
                        }

                        if (!chapterCreated) {
                            console.error('Skipping verses for failed chapter:', chapter.capitulo);
                            continue;
                        }

                        //iterate through the verses of each chapter
                        //const verses
                        const verses = chapter.versiculos;
                        const verseKeys = Object.keys(verses);
                        const versesToCreate: CreateVerseDto[] = [];

                        for (let k = 0; k < verseKeys.length; k++) {
                            const verseKey = verseKeys[k];
                            const verse = verses[verseKey];
                            const dto = new CreateVerseDto();
                            dto.number = verse.versiculo;
                            dto.text = verse.texto;
                            dto.chapterId = chapterCreated.id;
                            versesToCreate.push(dto);
                            // const verseCreated = await verseService.create(dto);
                        }
                        try {
                            await Promise.all(versesToCreate.map(dto => verseService.create(dto)));
                        }
                        catch (error) {
                            console.error('error while processing verses from chapter: ', chapterCreated.number)
                            throw error;
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.error('Error during seed:', error);
        throw error;
    } finally {
        if (app) {
            await app.close();
        }
    }
}

seedBible()
    .then(() => {
        console.log('Seed concluido.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Erro ao executar o seed:', error);
        process.exit(1);
    });

