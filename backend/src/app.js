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
const cadastrarProjetoRoutes = require('./hub/routes/cadastrar-projeto.routes');

app.use('/api', cadastroRoutes);
app.use('/api', loginRoutes);
app.use('/api', perfilRoutes);
app.use('/api', projetoRoutes);
app.use('/api', cadastrarProjetoRoutes);

const pastaUploads = path.join(__dirname, '../../uploads');

// nosniff impede o navegador de "adivinhar" o tipo do arquivo e executar como
// HTML algo que foi salvo como imagem. E a segunda camada de defesa: a primeira
// e a lista de extensoes nos middlewares de upload.
app.use('/uploads', express.static(pastaUploads, {
    setHeaders: (res) => {
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Content-Security-Policy', "default-src 'none'; img-src 'self'");
    }
}));

// Rota de API inexistente responde JSON, e nao a pagina de erro em HTML do Express.
app.use('/api', (req, res) => {
    res.status(404).json({ mensagem: 'Rota não encontrada' });
});

// Tratamento central de erros. Sem ele, uma falha do multer (arquivo grande
// demais ou tipo invalido) acontece ANTES do controller e vaza como 500 com
// rastro de pilha, em vez do 400 com mensagem util.
app.use((err, req, res, next) => {
    const limites = {
        LIMIT_FILE_SIZE: 'Arquivo acima do tamanho permitido.',
        LIMIT_FILE_COUNT: 'Quantidade de arquivos acima do permitido.',
        LIMIT_UNEXPECTED_FILE: 'Campo de arquivo inesperado.'
    };

    if (limites[err.code]) {
        return res.status(400).json({ mensagem: limites[err.code] });
    }

    if (err.status) {
        return res.status(err.status).json({ mensagem: err.message });
    }

    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

module.exports = app;