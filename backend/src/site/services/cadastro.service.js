// bcryptjs cria o "hash" da senha (uma versão embaralhada que não dá para desfazer)
const bcrypt = require('bcryptjs');

//reaproveitamos as mesmas funcoes de validação do front(arquivo validacoes.js)
const {cpfValido, cnpjValido, senhaForte, emailValido} = require('../../../../src/js/site/validacoes');

//o repositorio é quem guarda e procura usuarios
const usuarios = require('../../shared/repositories/usuarios.repository');

//cria um erro que ja carrega o codigo HTTP (400, 409...)
//o controller vai ler esse "status" para saber o que responder
function erro(status, mensagem) {
    const e = new Error (mensagem);
    e.status = status;
    return e;
}

//confere se é um texto com pelo menos "min" caracteres (ignorando espacos das pontas)
const textoPreenchido = (v, min = 1) => typeof v === 'string' && v.trim().length >= min;

//async pq o bcrypt.hash demora um pouco e precisamos esperar (await)
async function cadastrar(dados = {}){
    //1. VALIDAR: o back nunca confia no que veio do front.
  // Cada "if" que falha lança (throw) um erro 400 e a função para ali.
  if (!textoPreenchido(dados.nome, 3)) throw erro(400, 'Nome inválido');
  if (!cpfValido(dados.cpf ?? '')) throw erro(400, 'CPF inválido')
}   



//Parei aqui, continuar