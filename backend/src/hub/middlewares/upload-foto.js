const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const pastaFotos = path.join(__dirname, '../../../../uploads/perfis');

fs.mkdirSync(pastaFotos, { recursive: true });

const armazenamento = multer.diskStorage({
    destination: (req, arquivo, callback) => {
        callback(null, pastaFotos);
    },

    filename: (req, arquivo, callback) => {
        const extensao = path.extname(arquivo.originalname).toLowerCase();
        const nomeArquivo = crypto.randomUUID() + extensao;

        callback(null, nomeArquivo);
    }
});

const upload = multer({
    storage: armazenamento,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, arquivo, callback) => {
        if (arquivo.mimetype.startsWith('image/')) {
            callback(null, true);
        } else {
            callback(new Error('Envie apenas arquivos de imagem.'));
        }
    }
});

module.exports = upload;
