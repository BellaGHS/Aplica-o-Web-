const usuarios = [];
let proximoId = 1;


function salvar(dados) {
    const novo = {id: proximoId++, ...dados};
    usuarios.push(novo);
    return novo;
}
function buscarPorEmail(email) {
   return usuarios.find((u) => u.email === email);
}
function buscarPorCpf(cpf) {
    return usuarios.find((u) => u.cpf === cpf);
}

function buscarPorCnpj(cnpj) {
    return usuarios.find((u) => u.cnpj === cnpj);
}

function buscarPorSenha(senha) {
    return usuarios.find((u) => u.senha === senha);
}

function buscarPorId(id) {
    return usuarios.find((u) => u.id === id);
}

function limpar() {
    usuarios.length = 0;
    proximoId = 1;
}
function atualizar(id, campos){
    const usuario = buscarPorId(id);
    if (!usuario) return undefined;
    Object.assign(usuario, campos);
    return usuario;
}


module.exports = {salvar, buscarPorEmail, buscarPorCpf, buscarPorCnpj, buscarPorId, limpar, atualizar};