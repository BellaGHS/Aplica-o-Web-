
const request = require('supertest');
const app = require('../../src/app');

const usuariosRepository = require('../../src/shared/repositories/usuarios.repository');
const projetosRepository = require('../../src/shared/repositories/projetos.repository');
const { gerarToken } = require('../../src/shared/auth/token');

let token;

const dadosUsuarioValidos = () => ({
    nome: 'Ana',
    email: 'ana@email.com',
    telefone: '11 997745427',
    localizacao: 'São Paulo',
    sobre: 'Usuária de teste.',
    razaoSocial: 'Empresa Ana',
    fornece: 'projeto'
});

const dadosProjetoValidos = () => ({
    tituloProjeto: 'Prótese para membro inferior',
    quantidadePecas: '5',
    localizacao: 'São Paulo - SP',
    prazo: '2026-12-20',
    tipoPeca: 'Prótese',
    dimensoes: '20x30x10 cm',
    materiais: 'PLA, PETG',
    descricao: 'Projeto para desenvolvimento de uma prótese.',
    semPrazo: 'false',
    disponibilidade: 'disponivel',
    urgencia: 'normal'
});

beforeEach(() => {
    usuariosRepository.limpar();
    projetosRepository.limpar();

    const usuario = usuariosRepository.salvar(dadosUsuarioValidos());

    token = gerarToken(usuario.id);
});

// Função para enviar os dados como formulário multipart
function requisicaoCadastro(dados = dadosProjetoValidos()) {
    const requisicao = request(app)
        .post('/api/projetos')
        .set('Authorization', `Bearer ${token}`);

    Object.entries(dados).forEach(([campo, valor]) => {
        requisicao.field(campo, String(valor));
    });

    return requisicao;
}

describe('POST /api/projetos', () => {

    test('cadastra um projeto com sucesso', async () => {
        const res = await requisicaoCadastro();

        expect(res.status).toBe(201);
        expect(res.body.mensagem).toBe('Projeto cadastrado com sucesso');
        expect(res.body.projeto).toBeDefined();
        expect(res.body.projeto.id).toBeDefined();
        expect(res.body.projeto.tituloProjeto).toBe('Prótese para membro inferior');
        expect(res.body.projeto.quantidadePecas).toBe(5);
        expect(res.body.projeto.localizacao).toBe('São Paulo - SP');
        expect(res.body.projeto.tipoPeca).toBe('Prótese');
        expect(res.body.projeto.materiais).toBe('PLA, PETG');
    });

    test('não permite cadastrar projeto sem autenticação', async () => {
        const res = await request(app)
            .post('/api/projetos')
            .field('tituloProjeto', 'Prótese para membro inferior');

        expect(res.status).toBe(401);
    });

    test('não permite cadastrar projeto para usuário que fornece máquinas', async () => {
        usuariosRepository.limpar();

        const usuario = usuariosRepository.salvar({
            ...dadosUsuarioValidos(),
            fornece: 'maquina'
        });

        const tokenMaquina = gerarToken(usuario.id);

        const res = await request(app)
            .post('/api/projetos')
            .set('Authorization', `Bearer ${tokenMaquina}`)
            .field('tituloProjeto', 'Prótese para membro inferior')
            .field('quantidadePecas', '5')
            .field('localizacao', 'São Paulo - SP')
            .field('tipoPeca', 'Prótese')
            .field('descricao', 'Projeto para desenvolvimento de uma prótese.');

        expect(res.status).toBe(403);
    });

    test('retorna 400 quando o título é inválido', async () => {
        const res = await requisicaoCadastro({
            ...dadosProjetoValidos(),
            tituloProjeto: 'AB'
        });

        expect(res.status).toBe(400);
    });

    test('retorna 400 quando a quantidade de peças é inválida', async () => {
        const res = await requisicaoCadastro({
            ...dadosProjetoValidos(),
            quantidadePecas: '-5'
        });

        expect(res.status).toBe(400);
    });

    test('retorna 400 quando o tipo de peça não é informado', async () => {
        const res = await requisicaoCadastro({
            ...dadosProjetoValidos(),
            tipoPeca: ''
        });

        expect(res.status).toBe(400);
    });

    test('retorna 400 quando a localização não é informada', async () => {
        const res = await requisicaoCadastro({
            ...dadosProjetoValidos(),
            localizacao: ''
        });

        expect(res.status).toBe(400);
    });
});
