const service = require('../services/cadastro.service');

async function login(req, res) {
    try {
        const usuario = await service.login(req.body);
        res.status(201).json({mensagem: 'Login realizado com sucesso', usuario});
    } catch (err) {
        if (err.status) return res.status(err.status)
    }
}