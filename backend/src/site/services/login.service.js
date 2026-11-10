const bcrypt = require('bcryptjs');
const { emailValido } = require('../../../../frontend/src/js/site/validacoes');
const usuarios = require('../../shared/repositories/usuarios.repository');

function erro(status, mensagem) {
    const e = new Error(mensagem);
    e.status = status;
    return e;
}

async function login(dados = {}) {
    if (!emailValido(dados.email ?? '')) {
        throw erro(400, 'E-mail incorreto');
    }
    if (typeof dados.senha !== 'string' || !dados.senha) {
        throw erro(400, 'Senha obrigatória');
    }
    const email = dados.email.trim().toLowerCase();
    const usuario = usuarios.buscarPorEmail(email);

    if (!usuario) {
        throw erro(401, 'E-mail ou senha incorretos');
    }
    const senhaCorreta = await bcrypt.compare(
        dados.senha,
        usuario.senhaHash
    );

    if (!senhaCorreta) {
        throw erro(401, 'E-mail ou senha incorretos');
    }
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        fornece: usuario.fornece
    };
}

module.exports = { login };