const request = require('supertest');
const app = require('../app.js');

describe('GET /', () => {
    it('should return Hola Mundo', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Hola Mundo');
    });
});

describe('GET /saludo', () => {
    it('should return Bienvenido', async () => {
        const res = await request(app).get('/saludo');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('Bienvenido');
    });
});