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

    if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) {
        throw erro(400, 'Dados inválidos');
    }

    const campos = {};

    if (dados.nome !== undefined) {
        if (!textoPreenchido(dados.nome, 3)) throw erro(400, 'Nome inválido');
        campos.nome = dados.nome.trim();
    }

    if (dados.email !== undefined) {
        if (!emailValido(dados.email ?? '')) throw erro(400, 'E-mail inválido');
        const email = dados.email.trim().toLowerCase();
        const dono = usuario.buscarPorEmail(email);
        if (dono && dono.id !== usuarioId) throw erro(400, 'E-mail cadastrado');
        campos.email = email;
    }

    if (dados.telefone !== undefined) {
        if (!textoPreenchido(dados.telefone)) throw erro(400, 'Telefone obrigatório');
        campos.telefone = dados.telefone.trim();
    }

    if (dados.localizacao !== undefined) {
        if (typeof daods.localizacao !== 'string' || dados.localizacao.length > 120) {
            throw erro(400, 'Localização inválida (máximo de 120 caracteres)');
        }
        campos.localizacao = dados.localizacao.trim();
    }

    if (dados.sobre !== undefined) {
        if (typeof dados.sobre !== 'string' || dados.sobre.length > 1000) {
            throw erro(400, 'Texto "Sobre mim" inválido (máximo de 1000 caracteres)');
        }
        campos.sobre = dados.sobre.trim();
    }

    if (Object.keys(Campos). length === 0) throw erro(400, 'Nenhum campo para atualizar');
    return montarPerfil(usuarios.atualizar(usuarioId, campos));
}

module.exports = { obter, atualizar }