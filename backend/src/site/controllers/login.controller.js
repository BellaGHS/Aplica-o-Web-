const service = require('../services/login.service');

async function login(req, res) {
    try {
        const usuario = await service.login(req.body);

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            usuario
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

module.exports = { login };