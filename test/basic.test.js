const request = require('supertest');

// Crear una instancia de la app para testing
const express = require('express');
const app = express();

// Configurar las rutas de prueba
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});

app.get('/saludo', (req, res) => {
    res.send('¡Bienvenido al servidor!');
});

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