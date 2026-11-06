const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

const cadastroRoutes = require('./site/routes/cadastro.routes');
const loginRoutes = require('./site/routes/login.routes');

app.use('/api', cadastroRoutes);
app.use('/api', loginRoutes);

const pastaFront = path.join(__dirname, '../../frontend/src');
app.use('/frontend/src', express.static(pastaFront));
app.use(express.static(pastaFront));
app.get('/', (req, res) => res.redirect('/html/site/index.html'));

const perfilRoutes = require('./hub/routes/perfil.routes');
app.use('/api', perfilRoutes);

module.exports = app;