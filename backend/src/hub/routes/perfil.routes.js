const express = require('express');
const controller = require('../controllers/perfil.controller');
const autenticar = require('../../shared/middlewares/autenticar');

const router = express.Router();

router.get('/perfil', autenticar, controller.obter);     // GET /api/perfil
router.put('/perfil', autenticar, controller.atualizar); // PUT /api/perfil

module.exports = router;