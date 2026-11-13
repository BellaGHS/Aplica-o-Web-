const service = require('../services/perfil-projeto.service');

function responderErro(err, res) {
    if (err.status) return res.status(err.status).json({ mensagem: err.message });
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}

function obter(req, res) {
    try {
        res.status(200).json({ projeto: service.obter(req.params.projetoId) });
    } catch (err) {
        responderErro(err, res);
    }
}
function atualizar(req, res) {
    try {
        const imagem = req.files && req.files.imagem ? req.files.imagem[0] : undefined;
        const arquivo = req.files && req.files.arquivo ? req.files.arquivo[0] : undefined;
        const projeto = service.atualizar(req.params.projetoId, req.body || {}, imagem, arquivo);
        res.status(200).json({ mensagem: 'Projeto atualizado com sucesso', projeto });
    } catch (err) {
        responderErro(err, res);
    }
}

module.exports = { obter, atualizar }