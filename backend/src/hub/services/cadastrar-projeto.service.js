const projetosRepository = require('../../shared/repositories/projetos.repository');
const usuariosRepository = require('../../shared/repositories/usuarios.repository');

function erro(status, mensagem) {
    const e = new Error(mensagem);
    e.status = status;
    return e;
}

const textoPreenchido = (valor, minimo = 1) =>
    typeof valor === 'string' && valor.trim().length >= minimo;

function cadastrar(usuarioId, dados, imagem, arquivo) {
    const usuario = usuariosRepository.buscarPorId(usuarioId);

    if(!usuario) {
        throw erro(404, 'Usuário não encontrado');
    }
    if(usuario.fornece !== 'projeto') {
        throw erro(403, 'Usuário não pode cadastrar projetos');
    }
    if(!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw erro(400, 'Dados inválidos');
    }
    if(!textoPreenchido(dados.tituloProjeto, 3)) {
        throw erro(400, 'Nome do projeto é inválido');
    }
    const quantidade = Number(dados.quantidadePecas);
    if(!Number.isInteger(quantidade) || quantidade <= 0) {
        throw erro(400, 'Quantidade de peças inválida');
    }
    if(!textoPreenchido(dados.tipoPeca)) {
        throw erro(400, 'Selecione pelo menos um tipo de peça');
    }
    if(!textoPreenchido(dados.localizacao)) {
        throw erro(400, 'Cidade e estado são obrigatórios');
    }
    if(typeof dados.descricao !== 'string'|| dados.descricao.length > 1000) {
        throw erro(400, 'Descrição inválida');
    }
    if(dados.dimensoes && dados.dimensoes.length > 100) {
        throw erro(400, 'Dimensões inválida');
    }
    if(dados.materiais && dados.materiais.length > 300) {
        throw erro(400, 'Materiais inválidos');
    }

    const campos = {
        donoId: usuarioId,
        tituloProjeto: dados.tituloProjeto.trim(),
        quantidadePecas: quantidade,
        tipoPeca: dados.tipoPeca.trim(),
        materiais: dados.materiais || '',
        descricao: dados.descricao.trim(),
        localizacao: dados.localizacao.trim(),
        dimensoes: dados.dimensoes || '',
        prazo: dados.prazo || '',
        semPrazo: dados.semPrazo === 'true',
        disponibilidade: dados.disponibilidade || '',
        urgencia: dados.urgencia || '',
        imagemProjeto: imagem
            ? `/uploads/projetos/${imagem.filename}`
            : '',
        arquivo: arquivo
            ? `/uploads/projetos/${arquivo.filename}`
            : '',
        fornece: usuario.fornece
    };

    const novoProjeto = projetosRepository.salvar(campos);
    return novoProjeto;
}

module.exports = { cadastrar };