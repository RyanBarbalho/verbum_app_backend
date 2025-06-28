import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { CreateBookDto } from 'src/bible/dto/book.dto';
import { AppModule } from '../../app.module';
import { BookService } from '../../bible/book.service';
import { ChapterService } from '../../bible/chapter.service';
import { VerseService } from '../../bible/verse.service';

function handleAbbreviation(name: string) {
    switch (name) {
        // Old Testament
        case "Gênesis":
            return "Gn";
        case "Êxodo":
            return "Êx";
        case "Levítico":
            return "Lv";
        case "Números":
            return "Nm";
        case "Deuteronômio":
            return "Dt";
        case "Josué":
            return "Js";
        case "Juízes":
            return "Jz";
        case "Rute":
            return "Rt";
        case "I Samuel":
            return "1Sm";
        case "II Samuel":
            return "2Sm";
        case "I Reis":
            return "1Rs";
        case "II Reis":
            return "2Rs";
        case "I Crônicas":
            return "1Cr";
        case "II Crônicas":
            return "2Cr";
        case "Esdras":
            return "Ed";
        case "Neemias":
            return "Ne";
        case "Tobias":
            return "Tb";
        case "Judite":
            return "Jt";
        case "Ester":
            return "Et";
        case "Jó":
            return "Jó";
        case "Salmos":
            return "Sl";
        case "I Macabeus":
            return "1Mc";
        case "II Macabeus":
            return "2Mc";
        case "Provérbios":
            return "Pv";
        case "Eclesiastes":
            return "Ec";
        case "Cântico dos Cânticos":
            return "Ct";
        case "Sabedoria":
            return "Sb";
        case "Eclesiástico":
            return "Eclo";
        case "Isaías":
            return "Is";
        case "Jeremias":
            return "Jr";
        case "Lamentações":
            return "Lm";
        case "Baruc":
            return "Br";
        case "Ezequiel":
            return "Ez";
        case "Daniel":
            return "Dn";
        case "Oséias":
            return "Os";
        case "Joel":
            return "Jl";
        case "Amós":
            return "Am";
        case "Abdias":
            return "Ab";
        case "Jonas":
            return "Jn";
        case "Miquéias":
            return "Mq";
        case "Naum":
            return "Na";
        case "Habacuc":
            return "Hc";
        case "Sofonias":
            return "Sf";
        case "Ageu":
            return "Ag";
        case "Zacarias":
            return "Zc";
        case "Malaquias":
            return "Ml";

        // New Testament
        case "São Mateus":
            return "Mt";
        case "São Marcos":
            return "Mc";
        case "São Lucas":
            return "Lc";
        case "São João":
            return "Jo";
        case "Atos dos Apóstolos":
            return "At";
        case "Romanos":
            return "Rm";
        case "I Coríntios":
            return "1Co";
        case "II Coríntios":
            return "2Co";
        case "Gálatas":
            return "Gl";
        case "Efésios":
            return "Ef";
        case "Filipenses":
            return "Fp";
        case "Colossenses":
            return "Cl";
        case "I Tessalonicenses":
            return "1Ts";
        case "II Tessalonicenses":
            return "2Ts";
        case "I Timóteo":
            return "1Tm";
        case "II Timóteo":
            return "2Tm";
        case "Tito":
            return "Tt";
        case "Filêmon":
            return "Fm";
        case "Hebreus":
            return "Hb";
        case "São Tiago":
            return "Tg";
        case "I São Pedro":
            return "1Pe";
        case "II São Pedro":
            return "2Pe";
        case "I São João":
            return "1Jo";
        case "II São João":
            return "2Jo";
        case "III São João":
            return "3Jo";
        case "São Judas":
            return "Jd";
        case "Apocalipse":
            return "Ap";

        default:
            return name.substring(0, 3).toUpperCase();
    }
}

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

        const result = bookService.teste();
        console.log('teste: ', result);
        // TODO: Add your seeding logic here
        let book;
        let chapter;
        let verse;
        let testament;
        let bookDto,chapterDto,verseDto;
        for( const key in bibleData) {
            //we're iterating thorught the testaments (2)
            //start creating the book, for this. we'll iterate through books
            //we'll iterate through each book, so:
            for (const bookKey in bibleData[key]) {
                const book = bibleData[key][bookKey]
                let dto = new CreateBookDto;
                dto.testament = key === "antigoTestamento" ? "old" : "new";
                dto.abbreviation = handleAbbreviation(book.nome);
            }
        }


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

