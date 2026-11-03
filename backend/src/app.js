const express = require('express');
const path = require('path');

const app = express();

//faz o servidor entender o JSON. Sem essa linha, req.body chega vazio.
app.use(express.json());

//encaixa as rotas do cadastro dob o prefixo /api -> POST /api/cadastro
app.use('/api', require('./site/routes/cadastro.routes'));
//app.use('/api', require('./site/routes/login.routes'));

// Entrega o front (HTML, CSS, JS) da pasta src.
// Abra: http://localhost:3000/html/site/index.html
app.use(express.static(path.join(__dirname, '../../src')));

module.exports = app;