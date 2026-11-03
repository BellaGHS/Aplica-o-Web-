//liga método+endereço e uma função.

const express = require('express');
const controller = require('../controllers/cadastro.controller');

//router é um grupo de rotas que depois será encaixado no app
const router = express.Router();

// Quando chegar um POST em /cadastro, chama a função cadastrar do controller.
// O prefixo /api é colocado no app.js, então o endereço final é POST /api/cadastro.
router.post('/cadastro', controller.cadastrar);

module.exports = router;