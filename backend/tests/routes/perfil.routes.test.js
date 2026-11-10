const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const usuarios = require('../../src/shared/repositories/usuarios.repository');
const { gerarToken } = require('../../src/shared/auth/token');
const { verificarToken } = require('../../src/shared/auth/token');


let token;

const dadosValidos = () => ({
    nome: 'Ana',
    email: 'ana@email.com',
    telefone: '11 997745427',
    localizacao: 'São Paulo',
    sobre: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla interdum ipsum in porta. Nam sit amet nisi ullamcorper, tincidunt dui sit amet, sollicitudin urna. Donec ultricies sodales lorem vitae ultricies. Integer pretium convallis tortor. Mauris sollicitudin magna pulvinar fermentum luctus. In hac habitasse platea dictumst. Sed leo felis, bibendum eget magna vitae, mollis pharetra magna. Integer in tellus viverra, lacinia tellus ac, vestibulum augue. Nullam sit amet nisi ac elit blandit laoreet. Nam ut volutpat diam, maximus maximus justo.',
    razaoSocial: 'Empresa Ana',
    fornece: 'maquina',
});

beforeEach(() => {
    usuarios.limpar();
    const usuario = usuarios.salvar(dadosValidos());
    token = gerarToken(usuario.id);
    const { verificarToken } = require('../../src/shared/auth/token');
    console.log('ID:', usuario.id);
    console.log('TOKEN:', token);
    console.log('TOKEN VALIDADO:', verificarToken(token));
});


describe('GET /api/perfil', () => {
    test('retorna os dados do perfil com sucesso', async () => {
        const res = await request(app)
            .get('/api/perfil')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.perfil).toBeDefined();
        expect(res.body.perfil.nome).toBe('Ana');
        expect(res.body.perfil.email).toBe('ana@email.com');
    });
    test('não permite acessar o perfil sem autenticação', async () => {
        const res = await request(app)
            .get('/api/perfil');

        expect(res.status).toBe(401);
    });

    test('retorna 404 quando o usuário não existe', async () => {
        const tokenInvalido = gerarToken(999);

        const res = await request(app)
            .get('/api/perfil')
            .set('Authorization', `Bearer ${tokenInvalido}`);

        expect(res.status).toBe(404);
    });
});

describe('PUT /api/perfil', () => {
    test('atualiza os dados do perfil com sucesso', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Ana Oliveira',
                telefone: '11 999999999',
                localizacao: 'Guarulhos',
                sobre: 'Trabalho com impressão 3D.',
            });

        expect(res.status).toBe(200);
        expect(res.body.mensagem).toBe('Perfil atualizado com sucesso');
        expect(res.body.perfil.nome).toBe('Ana Oliveira');
        expect(res.body.perfil.telefone).toBe('11 999999999');
        expect(res.body.perfil.localizacao).toBe('Guarulhos');
    });

    test('não permite atualizar o perfil sem autenticação', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .send({ nome: 'Ana Oliveira' });

        expect(res.status).toBe(401);
    });

    test('retorna 400 quando o nome é inválido', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'An' });

        expect(res.status).toBe(400);
    });

    test('retorna 400 quando o e-mail é inválido', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'emailinvalido' });

        expect(res.status).toBe(400);
    });

    test('retorna 400 quando nenhum campo é enviado', async () => {
        const res = await request(app)
            .put('/api/perfil')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(res.status).toBe(400);
    });
});