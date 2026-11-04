// Por enquanto os usuários ficam numa lista na memória.
// Quando você escolher o banco de dados, só este arquivo muda.
const usuarios = [];
let proximoId = 1;


// Guarda um usuário novo e devolve ele com um id
function salvar(dados) {
    const novo = {id: proximoId++, ...dados};
    usuarios.push(novo);
    return novo;
}

//procura um usuário pelo e-mail(devolve undefined se nao achar)
function buscarPorEmail(email) {
   return usuarios.find((u) => u.email === email);
}

//procura um usuario pelo CPF
function buscarPorCpf(cpf) {
    return usuarios.find((u) => u.cpf === cpf);
}

function buscarPorCnpj(cnpj) {
    return usuarios.find((u) => u.cnpj === cnpj);
}

// Esvazia a lista. É usada nos testes, para cada teste começar do zero
function limpar() {
    usuarios.length = 0;
    proximoId = 1;
}

module.exports = {salvar, buscarPorEmail, buscarPorCpf, buscarPorCnpj, limpar};