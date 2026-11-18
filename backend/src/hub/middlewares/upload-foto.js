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

// O mimetype vem do cliente e pode ser forjado; a extensao vem do nome original
// e tambem. Por isso a extensao final e validada contra uma lista fechada: sem
// isso, um arquivo .html enviado como "image/png" seria salvo e depois servido
// como pagina pelo /uploads, executando script no dominio da aplicacao.
const EXTENSOES_IMAGEM = ['.png', '.jpg', '.jpeg', '.webp'];

function erroUpload(mensagem) {
    const e = new Error(mensagem);
    e.status = 400;
    return e;
}

const upload = multer({
    storage: armazenamento,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, arquivo, callback) => {
        const extensao = path.extname(arquivo.originalname).toLowerCase();

        if (EXTENSOES_IMAGEM.includes(extensao) && arquivo.mimetype.startsWith('image/')) {
            return callback(null, true);
        }

        return callback(erroUpload('Envie uma imagem PNG, JPG, JPEG ou WEBP.'));
    }
});

module.exports = upload;
