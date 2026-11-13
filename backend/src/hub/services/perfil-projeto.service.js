const projetosRepository = require('../../shared/repositories/projetos.repository');
const { obterTipo } = require('../config/tipos.config');

function erro(status, mensagem) {
    const e = new Error(mensagem);
    e.status = status;
    return e;
}

const textoPreenchido = (v, min = 1) => typeof v === 'string' && v.trim().length >= min;

function montarProjeto(projeto) {
    const tipo = obterTipo(projeto.fornece);
    if (!tipo) throw erro(400, 'Tipo de projeto inválido');
    return {
        id: projeto.id,
        tituloProjeto: projeto.tituloProjeto || '',
        imagemProjeto: projeto.imagemProjeto || '',
        quantidadePecas: projeto.quantidadePecas || '',
        localizacao: projeto.localizacao || '',
        prazo: projeto.prazo || '',
        tipoPeca: projeto.tipoPeca || '',
        dimensoes: projeto.dimensoes || '',
        materiais: projeto.materiais || '',
        arquivo: projeto.arquivo || '',
        descricao: projeto.descricao || '',
        fornece: tipo.fornece,

        banner: {
            tituloProjeto: projeto.tituloProjeto || '',
            imagemProjeto: projeto.imagemProjeto || '',
        },
    };
}

function obter(projetoId) {
    const projeto = projetosRepository.buscarPorId(projetoId);
    if (!projeto) throw erro(404, 'Projeto não encontrado');
    return montarProjeto(projeto);
}

function atualizar(projetoId, dados, imagem, arquivo) {
    const projeto = projetosRepository.buscarPorId(projetoId);
    if (!projeto) throw erro(404, 'Projeto não encontrado');
    if (dados === null || typeof dados !== 'object' || Array.isArray(dados)) {
        throw erro(400, 'Dados inválidos');
    }

    const campos = {};
    if (dados.tituloProjeto !== undefined) {
        if (!textoPreenchido(dados.tituloProjeto, 3)) {
            throw erro(400, 'Título inválido');
        }
        campos.tituloProjeto = dados.tituloProjeto.trim();
    }

    if (imagem) {
        campos.imagemProjeto = `/uploads/projetos/${imagem.filename}`;
    }

    if (dados.quantidadePecas !== undefined) {
        const quantidade = Number(dados.quantidadePecas);
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            throw erro(400, 'Quantidade de peças inválida');
        }
        campos.quantidadePecas = quantidade;
    }

    if (dados.localizacao !== undefined) {
        if (
            typeof dados.localizacao !== 'string' ||
            dados.localizacao.trim().length > 120
        ) {
            throw erro(400, 'Localização inválida (máximo de 120 caracteres)');
        }
        campos.localizacao = dados.localizacao.trim();
    }

    if (dados.descricao !== undefined) {
        if (
            typeof dados.descricao !== 'string' ||
            dados.descricao.trim().length > 1000
        ) {
            throw erro(400, 'Descrição inválida (máximo de 1000 caracteres)');
        }
        campos.descricao = dados.descricao.trim();
    }

    if (dados.tipoPeca !== undefined) {
        if (!textoPreenchido(dados.tipoPeca, 2)) {
            throw erro(400, 'Tipo de peça inválido');
        }
        campos.tipoPeca = dados.tipoPeca.trim();
    }

    if (dados.dimensoes !== undefined) {
        if (!textoPreenchido(dados.dimensoes, 2)) {
            throw erro(400, 'Dimensões inválidas');
        }
        campos.dimensoes = dados.dimensoes.trim();
    }

    if (dados.prazo !== undefined) {
        if (!textoPreenchido(dados.prazo, 2)) {
            throw erro(400, 'Prazo inválido');
        }
        campos.prazo = dados.prazo.trim();
    }

    if (dados.materiais !== undefined) {
        if (
            typeof dados.materiais !== 'string' ||
            dados.materiais.trim().length > 1000
        ) {
            throw erro(400, 'Materiais inválidos');
        }
        campos.materiais = dados.materiais.trim();
    }

    if (arquivo) {
        campos.arquivo = `/uploads/projetos/${arquivo.filename}`;
    }

    if (Object.keys(campos).length === 0) {
        throw erro(400, 'Nenhum campo para atualizar');
    }

    const projetoAtualizado = projetosRepository.atualizar(projetoId, campos);
    if (!projetoAtualizado) {
        throw erro(404, 'Projeto não encontrado');
    }
    return montarProjeto(projetoAtualizado);
}

module.exports = { obter, atualizar };