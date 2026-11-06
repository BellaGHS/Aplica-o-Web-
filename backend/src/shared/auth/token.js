const crypto = require('crypto');

const SEGREDO = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');
const VALIDADE_MS = 8 * 60 * 60 * 1000;

const b64 = (buf) => Buffer.from(buf).toString('base64url');
const assinar = (dados) => crypto.createHmac('sha256', SEGREDO).update(dados).digest('base64url');

function gerarToken(usuarioId) {
    const dados = b64(JSON.stringify({ sub: usuarioId, exp: Date.now() + VALIDADE_MS }));
    return `${dados}.${assinar(dados)}`;
}

function verificarToken(token) {
    if (typeof token !== 'string') return null;
    const [dados, assinatura, resto] = token.split('.');
    if (!dados || !assinatura || resto !== undefined) return null;
    const esperada = Buffer.from(assinar(dados));
    const recebida = Buffer.from(assinatura);
    if (esperada.length !== recebida.length || !crypto.timingSafeEqual(esperada, recebida)) return null;
    try {
        const { sub, exp } = JSON.parse(Buffer.from(dados, 'base64url').toString());
        return Number.isInteger(sub) && exp > Date.now() ? sub : null;
    } catch {
        return null;
    }
}

module.exports = { gerarToken, verificarToken };