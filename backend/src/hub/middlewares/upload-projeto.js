const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const pastaFotos = path.join(__dirname, '../../../../uploads/projetos');

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

function erroUpload(mensagem) {
    const e = new Error(mensagem);
    e.status = 400;
    return e;
}

const upload = multer({
    storage: armazenamento,
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: (req, arquivo, callback) => {
        const extensao = path.extname(arquivo.originalname).toLowerCase();

        if (arquivo.fieldname === 'imagem') {
            const extensoesImagem = ['.png', '.jpg', '.jpeg'];
            if (extensoesImagem.includes(extensao) &&
                arquivo.mimetype.startsWith('image/')) {
                return callback(null, true);
            }
            return callback(erroUpload('Envie uma imagem PNG, JPG ou JPEG.'));
        }

        if (arquivo.fieldname === 'arquivo') {
            const extensoesProjeto = ['.stl', '.stf', '.3mf', '.pdf'];
            if (extensoesProjeto.includes(extensao)) {
                return callback(null, true);
            }
            return callback(erroUpload('Formato inválido. Envie STL, STF, 3MF ou PDF.'));
        }

        return callback(erroUpload('Campo de arquivo inválido.'));
    }
});

module.exports = upload;