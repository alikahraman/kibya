const request = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/userModel');

jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => next(),
}));

let mongoServer;
let userId;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
})
beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const user = await User.create({
        name: 'Ali Poyraz',
        email: 'poyraz@deneme.com',
        password: await bcrypt.hash('tiyatro', salt),
    });
    userId = user._id;
    token = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '5d'});
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

describe('User Controller Tests', () => {

    it('kullanıcı kayıt testi - başarılı senaryo', async () => {
        const res = await request(app).post('/api/users/').send({
            name: 'Ferhan Şensoy',
            email: 'ferhan@deneme.com',
            password: 'sinema',
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.name).toBe('Ferhan Şensoy');
        expect(res.body.email).toBe('ferhan@deneme.com');
    });

    it('kullanıcı kayıt testi - mevcut kullanıcı senaryo', async () => {
        await request(app).post('/api/users/').send({
            name: 'Ali Poyraz',
            email: 'poyraz@deneme.com',
            password: 'kelime123',
        });
        const res = await request(app).post('/api/users/').send({
            name: 'Ali Poyraz',
            email: 'poyraz@deneme.com',
            password: 'kelime123',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Kullanıcı zaten kayıtlı');
    });

    it('kullanıcı kayıt testi - boş alan senaryo', async () => {
        const res = await request(app).post('/api/users/').send({
            email: 'bosalan@deneme.com',
            password: 'muzik',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Tüm alanları doldurunuz');
    });

    it('kullanıcı giriş testi - başarılı senaryo', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'poyraz@deneme.com',
            password: 'tiyatro',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('poyraz@deneme.com');
    });

    it('kullanıcı giriş testi - hatalı bilgi senaryo', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'poyraz@deneme.com',
            password: 'hatalisifre',
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Geçersiz kullanıcı bilgisi');
    });

    it('bütün kullanıcıları listeleme testi', async () => {
        const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe('Ali Poyraz');
    });

    it('bütün kullanıcıları listeleme testi - kullanıcı bulunamadı senaryo', async () => {
        await User.deleteMany({});
        const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Kullanıcı bulunamadı');
    });

    it('kullanıcı silme testi', async () => {
        const res = await request(app).delete(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Kullanıcı başarıyla silindi');
    });

    it('kullanıcı silme testi - kullanıcı bulunamadı senaryo', async () => {
        const invalidUserId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/users/${invalidUserId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Kullanıcı bulunamadı');
    });

});
