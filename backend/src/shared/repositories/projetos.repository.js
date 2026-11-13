const projetos = [];
let proximoId = 1;


function salvar(dados) {
    const novoProjeto = { id: proximoId++, ...dados };
    projetos.push(novoProjeto);
    return novoProjeto;
}
function buscarPorId(id) {
    return projetos.find(projeto => projeto.id === Number(id));
}

function limpar() {
    projetos.length = 0;
    proximoId = 1;
}
function atualizar(id, dados){
    const projeto = buscarPorId(id);
    if (!projeto) return null;
    Object.assign(projeto, dados);
    return projeto;
}


module.exports = {salvar, buscarPorId, limpar, atualizar};