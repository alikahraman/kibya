const request = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const app = require('../server');
const Book = require('../models/bookModel');

jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => next(),
}));

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

describe('Book Controller Tests', () => {

    it('kitap giriş testi', async () => {
        const res = await request(app).post('/api/books').send({
            isbn: '1234567890',
            title: 'Test Kitabı',
            author: 'Yazar Yazaroğlu',
            publisher: 'Yayınlar',
            size: '13,5 x 21 cm',
            coverType: 'Karton Kapak',
            price: '10',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Kitabı');
    });

    it('bütün kitapları çekme testi', async () => {
        await Book.create([
            {
                isbn: '1111',
                title: 'Kitap 1',
                author: 'Yazar 1',
                publisher: 'Yayınevi 1',
                size: '13,5 x 21 cm',
                coverType: 'Ciltli',
                price: '20'
            },
            {
                isbn: '2222',
                title: 'Kitap 2',
                author: 'Yazar 2',
                publisher: 'Yayınevi 2',
                size: '16 x 24 cm',
                coverType: 'Karton Kapak',
                price: '15'
            },
        ]);
        const res = await request(app).get('/api/books');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('id değeri ile kitap verisi çekme testi', async () => {
        const book = await Book.create({
            isbn: '1234567890',
            title: 'Test Kitabı',
            author: 'Yazar Yazaroğlu',
            publisher: 'Yayınlar',
            size: '13,5 x 21 cm',
            coverType: 'Karton Kapak',
            price: '10',
        });
        const res = await request(app).get(`/api/books/${book._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Test Kitabı');
    });

    it('kitap güncellemesi testi', async () => {
        const book = await Book.create({
            isbn: '1234567890',
            title: 'Test Kitabı',
            author: 'Yazar Yazaroğlu',
            publisher: 'Yayınlar',
            size: '13,5 x 21 cm',
            coverType: 'Karton Kapak',
            price: '10',
        });
        const updatedData = {
            id: book._id,
            title: 'Güncellenmiş Başlık',
            author: 'Güncellenmiş Yazar',
        };
        const res = await request(app).put(`/api/books/${book._id}`).send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Güncellenmiş Başlık');
        expect(res.body.author).toBe('Güncellenmiş Yazar');
    });

    it('kitap silme testi', async () => {
        const book = await Book.create({
            isbn: '1234567890',
            title: 'Test Kitabı',
            author: 'Yazar Yazaroğlu',
            publisher: 'Yayınlar',
            size: '13,5 x 21 cm',
            coverType: 'Karton Kapak',
            price: '10',
        });
        const res = await request(app).delete(`/api/books/${book._id}`);
        expect(res.statusCode).toBe(204);
    });

    it('toplu kitap giriş testi', async () => {
        const res = await request(app).post('/api/books/import').send([
            {
                isbn: '1111',
                title: 'Kitap 1',
                author: 'Yazar 1',
                publisher: 'Yayınevi 1',
                size: '13,5 x 21 cm',
                coverType: 'Ciltli',
                price: '20'
            },
            {
                isbn: '2222',
                title: 'Kitap 2',
                author: 'Yazar 2',
                publisher: 'Yayınevi 2',
                size: '16 x 24 cm',
                coverType: 'Karton Kapak',
                price: '15'
            },
        ]);
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toContain('kitap başarıyla eklendi');
    });

    it('bütün kitapları silme testi', async () => {
        await Book.create([
            {
                isbn: '1111',
                title: 'Kitap 1',
                author: 'Yazar 1',
                publisher: 'Yayınevi 1',
                size: '13,5 x 21 cm',
                coverType: 'Ciltli',
                price: '20'
            },
            {
                isbn: '2222',
                title: 'Kitap 2',
                author: 'Yazar 2',
                publisher: 'Yayınevi 2',
                size: '16 x 24 cm',
                coverType: 'Karton Kapak',
                price: '15'
            },
        ]);
        const res = await request(app).delete('/api/books/drop');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Tüm kitaplar başarıyla silindi!');
    });
});
