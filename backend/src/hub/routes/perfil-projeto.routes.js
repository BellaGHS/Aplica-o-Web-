const express = require('express');
const controller = require('../controllers/perfil-projeto.controller');
const autenticar = require('../../shared/middlewares/autenticar');
const upload = require('../middlewares/upload-projeto');

const router = express.Router();

const receberArquivos = upload.fields([
    { name: 'imagem', maxCount: 1 },
    { name: 'arquivo', maxCount: 1 }
]);

router.get('/projetos/:projetoId', autenticar, controller.obter);
router.put('/projetos/:projetoId', autenticar, receberArquivos, controller.atualizar);

module.exports = router;