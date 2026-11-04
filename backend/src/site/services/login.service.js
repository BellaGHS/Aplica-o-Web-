const bcrypt = require('bcryptjs');
const{emailValido, senhaCorreta} = require('../../../../frontend/src/js/site/validacoes');
const usuarios = require('../../shared/repositories/usuarios.repository');

function erro(status, mensagem) {
    const e = new Error (mensagem);
    e.status = status;
    return e;
}
async function cadastrar(dados = {}) {
  if (!emailValido(dados.email ?? '')) throw erro(400, 'E-mail incorreto');
  if (typeof dados.senha !== 'string' || !senhaCorreta(dados.senha)) throw erro(400, 'Senha obrigátoria');
    
    const email = dados.email.trim().toLowerCase();
    const usuario = usuarios.buscarPorEmail(email);

    if (!senhaCorreta) {
        throw erro(401, 'E-mail ou senha encorretos');
    }

    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
    };
}

module.exports = {login};
