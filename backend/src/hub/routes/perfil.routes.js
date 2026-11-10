const express = require('express');
const controller = require('../controllers/perfil.controller');
const autenticar = require('../../shared/middlewares/autenticar');
const upload = require('../middlewares/upload-foto')

const router = express.Router();

router.get('/perfil', autenticar, controller.obter);    
router.put('/perfil', autenticar, upload.single('foto'), controller.atualizar); 

module.exports = router;