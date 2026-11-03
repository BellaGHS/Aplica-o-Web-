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
  if (!cpfValido(dados.cpf ?? '')) throw erro(400, 'CPF inválido');
  if (!textoPreenchido(dados.telefone)) throw erro(400, 'Telefone obrigatório');
  if (!emailValido(dados.email ?? '')) throw erro(400, 'E-mail inválido');
  if (typeof dados.senha !== 'string' || !senhaForte(dados.senha)) {
    throw erro(400, 'Senha fraca: use 8+ caracteres com maiúscula, minúscula, número e símbolo');
  }
  if (!cnpjValido(dados.cnpj ?? '')) throw erro(400, 'CNPJ inválido');
  if (!textoPreenchido(dados.razaoSocial ?? '')) throw erro(400, 'Razão social obrigatória');
  if (!['maquina', 'projeto'].includes(dados.fornece)) throw erro(400, 'Tipo de fornecimento inválido');

    // 2. LIMPAR: deixa os dados num formato único antes de guardar
    const email = dados.email.trim().toLowerCase(); //minuscula, sem espaços
    const cpf = String(dados.cpf).replace(/\D/g, ''); //so os numeros
    const cnpj = String(dados.cnpj).replace(/[.\/-]/g, '').toUpperCase();

    // 3. CONFERIR REPETIDOS: 409 significa "conflito" (já existe)
    if (usuarios.buscarPorEmail(email)) throw erro(409, 'E-mail já cadastrado');
    if (usuarios.buscarPorCpf(cpf)) throw erro(409, 'CPF já cadastrado');

    // 4. HASH DA SENHA: nunca guardamos a senha de verdade.
  // O 10 é o "custo": quanto maior, mais lento (e mais seguro) de gerar.
  const senhaHash = await bcrypt.hash(dados.senha, 10);

  // 5. SALVAR: repare que guardamos "senhaHash" e NÃO "senha"
  const salvo = usuarios.salvar({
    nome: dados.nome.trim(),
    cpf,
    telefone: dados.telefone.trim(),
    email,
    senhaHash,
    cnpj,
    razaoSocial: dados.razaoSocial.trim(),
    fornece: dados.fornece,
  });

  // 6. DEVOLVER só o que é seguro mostrar (sem CPF, sem hash)
  return {id: salvo.id, nome: salvo.nome, email: salvo.email};
}   

module.exports = {cadastrar};

//throw erro(...) interrompe a função na hora.
//dados.cpf ?? '' quer dizer "se o CPF não veio (undefined), use um texto vazio"