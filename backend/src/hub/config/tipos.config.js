const PASTA_HUB = '/frontend/src/html/hub_digital';
const PASTA_IMG = '/frontend/src/img';

const paginasComuns = {
    inicio: `${PASTA_HUB}/maquinas/inicio-hub`,
    conexoes: `${PASTA_HUB}/maquinas/concexoes-maquina`,
    mensagens: `${PASTA_HUB}/maquinas/mensagens`,
    configuracoes: `${PASTA_HUB}/maquinas/configuracoes`,
    perfil: `${PASTA_HUB}/maquinas/perfil-maquina`,
    editarPerfil: `${PASTA_HUB}/maquinas/editar-perfil`,
};


function montarMenu(paginas, meusItens) {
    return [
        { chave: 'inicio', rotulo: 'Início', icone: 'bi-house-door-fill', href: paginas.inicio },
        { chave: 'conexoes', rotulo: 'Conexões', icone: 'bi-globe2', href: paginas.conexoes },
        { chave: 'meusItens', rotulo: meusItens.rotulo, icone: meusItens.icone, href: paginas.meusItens },
        { chave: 'mensagens', rotulo: 'Mensagem', icone: 'bi-chat-left-text-fill', href: paginas.mensagens },
    ];
}


const maquina = {
    fornece: 'maquina',
    etiqueta: 'Fornecedor de máquina',
    itemSingular: 'Máquina',
    itemPlural: 'Máquinas',
    icone: 'bi-printer-fill',
    imagem: `${PASTA_IMG}/maquina-notificacao.png`,
    textos: {
        tituloInicio: 'Encontre o projeto ideal',
        tituloMeusItens: 'Minhas máquinas',
        botaoCadastrar: 'Cadastrar máquina',
    },
    paginas: {
        ...paginasComuns,
        meusItens: `${PASTA_HUB}/maquinas/minhas-maquinas/`,
        cadastrarItem: `${PASTA_HUB}/maquinas/cadastrar-maquina/`,
    },
};

const projeto = {
    fornece: 'projeto',
    etiqueta: 'Fornecedor de projetos',
    itemSingular: 'Projeto',
    itemPlural: 'Projetos',
    icone: 'bi-clipboard2-fill',
    imagem: `${PASTA_IMG}/projeto-notificacao.png`,
    textos: {
        tituloInicio: 'Encontre a máquina ideal',
        tituloMeusItens: 'Meus projetos',
        botaoCadastrar: 'Cadastrar projeto',
    },
    paginas: {
        ...paginasComuns,
        meusItens: `${PASTA_HUB}/projeto/meus-projetos/`,
        cadastrarItem: `${PASTA_HUB}/projeto/cadastrar-projeto/`,
    },
};

const TIPOS = { maquina, projeto };

function obterTipo(fornece) {
    const t = TIPOS[fornece] || TIPOS.maquina;
    return {
    ...t,
    menu: montarMenu(t.paginas, { rotulo: t.textos.tituloMeusItens, icone: t.icone }),
    };
}

module.exports = { obterTipo };