const service = require('../services/cadastrar-projeto.service');


function cadastrar(req, res) {
    try {
        const imagem = req.files?.imagem?.[0];
        const arquivo = req.files?.arquivo?.[0];
        const projeto = service.cadastrar(
            req.usuarioId,
            req.body,
            imagem,
            arquivo
        );
        return res.status(201).json({
            mensagem: 'Projeto cadastrado com sucesso',
            projeto
        });
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({
                mensagem: err.message
            });
        }
        console.error(err);

        return res.status(500).json({
            mensagem: 'Erro interno do servidor'
        });
    }
}

module.exports = { cadastrar }