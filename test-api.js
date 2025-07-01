const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
    try {
        console.log('🧪 Testing Bible API...\n');

        // Test 1: Get all books
        console.log('1. Getting all books...');
        const books = await axios.get(`${BASE_URL}/bible/books`);
        console.log(`✅ Found ${books.data.length} books\n`);

        // Test 2: Get Old Testament books
        console.log('2. Getting Old Testament books...');
        const oldTestament = await axios.get(`${BASE_URL}/bible/books/testament/old`);
        console.log(`✅ Found ${oldTestament.data.length} Old Testament books\n`);

        // Test 3: Get New Testament books
        console.log('3. Getting New Testament books...');
        const newTestament = await axios.get(`${BASE_URL}/bible/books/testament/new`);
        console.log(`✅ Found ${newTestament.data.length} New Testament books\n`);

        // Test 4: Get a specific book by name
        console.log('4. Getting book by name (Gênesis)...');
        const genesis = await axios.get(`${BASE_URL}/bible/books/name/G%C3%AAnesis`);
        console.log(`✅ Found book: ${genesis.data.name}\n`);

        // Test 5: Get chapters of first book
        if (books.data.length > 0) {
            const firstBookId = books.data[0].id;
            console.log(`5. Getting chapters of first book (${books.data[0].name})...`);
            const chapters = await axios.get(`${BASE_URL}/bible/books/${firstBookId}/chapters`);
            console.log(`✅ Found ${chapters.data.length} chapters\n`);

            // Test 6: Get verses of first chapter
            if (chapters.data.length > 0) {
                const firstChapterId = chapters.data[0].id;
                console.log(`6. Getting verses of first chapter...`);
                const verses = await axios.get(`${BASE_URL}/bible/chapters/${firstChapterId}/verses`);
                console.log(`✅ Found ${verses.data.length} verses\n`);
            }
        }

        // Test 7: Get chapters of Gênesis specifically
        console.log('7. Getting chapters of Gênesis...');
        const genesisChapters = await axios.get(`${BASE_URL}/bible/books/${genesis.data.id}/chapters`);
        console.log(`✅ Found ${genesisChapters.data.length} chapters in Gênesis\n`);

        // Test 8: Get a specific chapter with verses
        if (genesisChapters.data.length > 0) {
            const firstChapter = genesisChapters.data[0];
            console.log(`8. Getting verses of Gênesis chapter ${firstChapter.number}...`);
            const chapterVerses = await axios.get(`${BASE_URL}/bible/chapters/${firstChapter.id}/verses`);
            console.log(`✅ Found ${chapterVerses.data.length} verses in chapter ${firstChapter.number}\n`);
        }

        console.log('🎉 All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAPI(); 