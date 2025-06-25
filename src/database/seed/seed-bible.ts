import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../../app.module';
import { BookService } from '../../bible/book.service';
import { ChapterService } from '../../bible/chapter.service';
import { VerseService } from '../../bible/verse.service';

async function seedBible() {
    let app;
    try {
        app = await NestFactory.createApplicationContext(AppModule);
        console.log('Iniciando seed da Bíblia...');
        
        // Try reading the JSON file directly
        const jsonPath = path.join(__dirname, 'bible-data.json');
        console.log('JSON path:', jsonPath);
        
        const jsonContent = fs.readFileSync(jsonPath, 'utf8');
        const bibleData = JSON.parse(jsonContent);
        console.log('Bible data loaded successfully');
        console.log('Keys in bibleData:', Object.keys(bibleData));
        console.log('Sample data:', JSON.stringify(bibleData, null, 2).substring(0, 500) + '...');

        const bookService = app.get(BookService);
        const chapterService = app.get(ChapterService);
        const verseService = app.get(VerseService);
        
        // TODO: Add your seeding logic here
        
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