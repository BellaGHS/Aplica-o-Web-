const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { emailValido } = require('../../../../frontend/src/js/site/validacoes');
const usuarios = require('../../shared/repositories/usuarios.repository');

// Hash descartavel, usado quando o e-mail nao existe. Sem ele, a resposta para
// e-mail inexistente volta na hora e a de e-mail existente leva o tempo do
// bcrypt -- diferenca suficiente para descobrir quem tem conta no sistema.
const HASH_INEXISTENTE = bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 10);

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

    // A comparacao roda sempre, exista o usuario ou nao, para que as duas
    // respostas levem o mesmo tempo.
    const senhaCorreta = await bcrypt.compare(
        dados.senha,
        usuario?.senhaHash ?? HASH_INEXISTENTE
    );

    if (!usuario || !senhaCorreta) {
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