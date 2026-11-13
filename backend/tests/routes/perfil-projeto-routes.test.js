
const request = require('supertest');
const app = require('../../src/app');

const usuariosRepository = require('../../src/shared/repositories/usuarios.repository');
const projetosRepository = require('../../src/shared/repositories/projetos.repository');
const { gerarToken } = require('../../src/shared/auth/token');

let token;
let projeto;

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
    quantidadePecas: 5,
    localizacao: 'São Paulo',
    prazo: '2026-12-20',
    tipoPeca: 'Prótese',
    dimensoes: '20x30x10 cm',
    materiais: 'PLA, PETG',
    descricao: 'Projeto para desenvolvimento de uma prótese.',
    fornece: 'projeto'
});

beforeEach(() => {
    usuariosRepository.limpar();
    projetosRepository.limpar();

    const usuario = usuariosRepository.salvar(dadosUsuarioValidos());

    token = gerarToken(usuario.id);

    projeto = projetosRepository.salvar(dadosProjetoValidos());
});

describe('GET /api/projetos/:projetoId', () => {

    test('retorna os dados do projeto com sucesso', async () => {
        const res = await request(app)
            .get(`/api/projetos/${projeto.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.projeto).toBeDefined();
        expect(res.body.projeto.id).toBe(projeto.id);
        expect(res.body.projeto.tituloProjeto).toBe('Prótese para membro inferior');
    });

    test('não permite acessar o projeto sem autenticação', async () => {
        const res = await request(app)
            .get(`/api/projetos/${projeto.id}`);

        expect(res.status).toBe(401);
    });

    test('retorna 404 quando o projeto não existe', async () => {
        const tokenInvalido = gerarToken(999);

        const res = await request(app)
            .get('/api/projetos/999')
            .set('Authorization', `Bearer ${tokenInvalido}`);

        expect(res.status).toBe(404);
    });
});

describe('PUT /api/projetos/:projetoId', () => {

    test('atualiza os dados do projeto com sucesso', async () => {
        const res = await request(app)
            .put(`/api/projetos/${projeto.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                tituloProjeto: 'Prótese para membro inferior',
                quantidadePecas: '5',
                localizacao: 'Guarulhos',
                prazo: '2026-12-20',
                tipoPeca: 'Prótese',
                dimensoes: '20x30x10 cm',
                materiais: 'PLA, PETG',
            });

        expect(res.status).toBe(200);
        expect(res.body.mensagem).toBe('Projeto atualizado com sucesso');
        expect(res.body.projeto.id).toBe(projeto.id);
        expect(res.body.projeto.tituloProjeto).toBe('Prótese para membro inferior');
        expect(res.body.projeto.quantidadePecas).toBe(5);
        expect(res.body.projeto.localizacao).toBe('Guarulhos');
        expect(res.body.projeto.prazo).toBe('2026-12-20');
        expect(res.body.projeto.tipoPeca).toBe('Prótese');
        expect(res.body.projeto.dimensoes).toBe('20x30x10 cm');
        expect(res.body.projeto.materiais).toBe('PLA, PETG');
    });

    test('não permite atualizar o projeto sem autenticação', async () => {
        const res = await request(app)
            .put(`/api/projetos/${projeto.id}`)
            .send({
                tituloProjeto: 'Novo título'
            });

        expect(res.status).toBe(401);
    });

    test('retorna 400 quando o título é inválido', async () => {
        const res = await request(app)
            .put(`/api/projetos/${projeto.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                tituloProjeto: 'AB'
            });

        expect(res.status).toBe(400);
    });

    test('retorna 400 quando a quantidade de peças é inválida', async () => {
        const res = await request(app)
            .put(`/api/projetos/${projeto.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                quantidadePecas: '-5'
            });

        expect(res.status).toBe(400);
    });

    test('retorna 400 quando nenhum campo é enviado', async () => {
        const res = await request(app)
            .put(`/api/projetos/${projeto.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(res.status).toBe(400);
    });
});
