const request = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const app = require('../server');
const Book = require('../models/bookModel');
const Shelf = require('../models/shelfModel');

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

describe('Shelf Controller Tests', () => {

    it('raf giriş testi', async () => {
        const res = await request(app).post('/api/shelves').send({
            location: 'X01',
            barcode: 'X010001',
            books: []
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.location).toBe('X01');
        expect(res.body.barcode).toBe('X010001');
    });

    it('bütün rafları çekme testi', async () => {
        await Shelf.create([
            {location: 'X01', barcode: 'X010001', books: []},
            {location: 'X02', barcode: 'X020002', books: []},
        ]);
        const res = await request(app).get('/api/shelves');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('id değeri ile rafı ve içindeki kitapları çekme testi', async () => {
        const book = await Book.create({
            isbn: '1234567890',
            title: 'Test Kitabı',
            author: 'Yazar Yazaroğlu',
            publisher: 'Yayınlar',
            size: '13,5 x 21 cm',
            coverType: 'Karton Kapak',
            price: '10',
        });
        const shelf = await Shelf.create({
            location: 'X01',
            barcode: 'X010001',
            books: [{id: book._id, count: 3}],
        });
        const res = await request(app).get(`/api/shelves/${shelf._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body[0].location).toBe('X01');
        expect(res.body[0].barcode).toBe('X010001');
        expect(res.body[0].books).toHaveLength(1);
        expect(res.body[0].books[0].bookDetails.title).toBe('Test Kitabı');
        expect(res.body[0].books[0].count).toBe(3);
    });

    it('rafa kitap ekleme tesi', async () => {
        const book = await Book.create({
            isbn: '1234567890',
            title: 'Test Kitabı',
            author: 'Yazar Yazaroğlu',
            publisher: 'Yayınlar',
            size: '13,5 x 21 cm',
            coverType: 'Karton Kapak',
            price: '10',
        });
        const shelf = await Shelf.create({
            location: 'X01',
            barcode: 'X010001',
            books: [],
        });
        const res = await request(app)
            .put(`/api/shelves/${shelf._id}/addbook`)
            .send({
                isbn: book.isbn,
                count: 5,
                increment: false,
                decrease: false,
                reset: true
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.books.length).toBeGreaterThan(0);
    });

    it('raf güncelleme testi', async () => {
        const shelf = await Shelf.create({
            location: 'X01',
            barcode: 'X010001',
            books: [],
        });
        const updatedShelf = {
            id: shelf._id,
            location: 'Y09',
            barcode: 'Y090009'
        };
        const res = await request(app)
            .put('/api/shelves/${shelf._id}')
            .send(updatedShelf);
        expect(res.statusCode).toBe(200);
        expect(res.body.location).toBe(updatedShelf.location);
        expect(res.body.barcode).toBe(updatedShelf.barcode);
    });

    it('raf Silme Testi', async () => {
        const shelf = await Shelf.create({
            location: 'X01',
            barcode: 'X010001',
            books: [],
        });
        const res = await request(app)
            .delete(`/api/shelves/${shelf._id}`);
        expect(res.statusCode).toBe(204);
    });

    it('toplu raf giriş testi', async () => {
        const shelves = [
            {location: 'X01', barcode: 'X010001', books: []},
            {location: 'Y01', barcode: 'Y010001', books: []}
        ];
        const res = await request(app)
            .post('/api/shelves/import')
            .send(shelves);
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('2 kitap başarıyla eklendi.');
    });

    it('raflara toplu kitap giriş testi', async () => {
        const book = await Book.create({
            isbn: '1234567890',
            title: 'Test Kitabı',
            author: 'Yazar Yazaroğlu',
            publisher: 'Yayınlar',
            size: '13,5 x 21 cm',
            coverType: 'Karton Kapak',
            price: '10',
        });
        const shelf = await Shelf.create({
            location: 'X01',
            barcode: 'X010001',
            books: [],
        });
        const bookEntries = [
            {isbn: book.isbn, barcode: shelf.barcode, count: 10}
        ];
        const res = await request(app)
            .post('/api/shelves/import/bookstoshelves')
            .send({bookEntries});
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Toplu kitap ekleme işlemi tamamlandı');
        expect(res.body.updates.length).toBeGreaterThan(0);
    });

    it('bütün rafları silme testi', async () => {
        const res = await request(app).delete('/api/shelves/drop');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Tüm raflar başarıyla silindi!');
    });

});
