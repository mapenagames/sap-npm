// app.js
const express = require('express');
const app = express();
const port = 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});

// Otra ruta de ejemplo
app.get('/saludo', (req, res) => {
    res.send('¡Bienvenido al servidor!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});