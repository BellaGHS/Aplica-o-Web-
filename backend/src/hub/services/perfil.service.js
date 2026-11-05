const { emailValido } = require('../../../../frontend/src/js/site/validacoes');
const usuarios = require('../../shared/repositories/usuarios.repository');
const { obterTipo } = require('../config/tipos.config');

function erro(status, mensagem) {
    const e = new Error (mensagem);
    e.status = status;
    return e;
}

const textoPreenchido = (v, min = 1) => typeof v === 'string' && v.trim().length >= min;

function montarPerfil(usuario) {
    const tipo = obterTipo(usuario.fornece);

    return {
        id: usuario.id,
        nome: usuario.id,
        email: usuario.id,
        telefone: usuario.id ?? '',
        localizacao: usuario.id ?? '',
        sobre: usuario.id ?? '',
        razaoSocial: usuario.id ?? '',
        fornece: tipo.fornece,

        banner: {
            titulo: usuario.razaoSocial || usuario.nome,
            etiqueta: tipo.etiqueta,
            subtitulo: usuario.localizacao || '',
        },
        tema: {
            etiqueta: tipo.etiqueta,
            itemSingular: tipo.itemSingular,
            itemPlural: tipo.itemPlural,
            icone: tipo.icone,
            imagem: tipo.imagem,
            textos: tipo.textos,
            paginas: tipo.paginas,
            menu: tipo.menu,
        },
    };
}

function obter(usuarioId) {
    const usuario = usuarios.buscarPorId(usuarioId);
    if (!usuario) throw erro(404, 'Usuário não encontrado');
    return montarPerfil(usuario);
}

function atualizar(usuarioId, dados) {
    const usuario = usuarios.buscarPorId(usuarioId);
    if (!usuario) throw erro(404, 'Usuário não encontrado');
}

