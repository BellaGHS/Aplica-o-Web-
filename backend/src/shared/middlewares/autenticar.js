const { verificarToken } = require('../auth/token');

function autenticar(req, res, next) {
    const [tipo, token] = (req.headers.authorization || '').split(' ');
    const usuarioId = tipo === 'Bearer' ? verificarToken(token) : null;

    if (usuarioId === null) {
        return res.status(401).json({ mensagem: 'Faça login para continuar' });
    }

    req.usuarioId = usuarioId;
    next();
}

module.exports = autenticar;