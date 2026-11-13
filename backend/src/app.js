const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

const pastaFront = path.join(__dirname, '../../frontend/src');
app.use('/frontend/src', express.static(pastaFront));
app.use(express.static(pastaFront));
app.get('/', (req, res) => res.redirect('/html/site/index.html'));

const cadastroRoutes = require('./site/routes/cadastro.routes');
const loginRoutes = require('./site/routes/login.routes');
const perfilRoutes = require('./hub/routes/perfil.routes');
const projetoRoutes = require('./hub/routes/perfil-projeto.routes');

app.use('/api', cadastroRoutes);
app.use('/api', loginRoutes);
app.use('/api', perfilRoutes);
app.use('/api', projetoRoutes);

const pastaUploads = path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(pastaUploads));

module.exports = app;