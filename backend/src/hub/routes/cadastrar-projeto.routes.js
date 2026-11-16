
const express = require('express');
const controller = require('../controllers/cadastrar-projeto.controller');
const autenticar = require('../../shared/middlewares/autenticar');
const upload = require('../middlewares/upload-projeto');

const router = express.Router();

const receberArquivos = upload.fields([
    { name: 'imagem', maxCount: 1 },
    { name: 'arquivo', maxCount: 1 }
]);

router.post(
    '/projetos',
    autenticar,
    receberArquivos,
    controller.cadastrar
);

module.exports = router;
