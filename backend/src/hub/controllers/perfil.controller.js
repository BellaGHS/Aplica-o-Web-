const service = require('../services/perfil.service');

function responderErro(err, res) {
    if (err.status) return res.status(err.status).json({ mensagem: err.message });
    console.error(err);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}

function obter(req, res) {
    try {
        res.status(200).json({ perfil: service.obter(req.usuarioId) });
    } catch (err) {
        responderErro(err, res);
    }
}
function atualizar(req, res) {
    try {
        const perfil = service.atualizar(req.usuarioId, req.body, req.file);
        res.status(200).json({ mensagem: 'Perfil atualizado com sucesso', perfil });
    } catch (err) {
        responderErro(err, res);
    }
}

module.exports = { obter, atualizar }