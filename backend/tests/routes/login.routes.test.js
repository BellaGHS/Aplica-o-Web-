const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const usuarios = require('../../src/shared/repositories/usuarios.repository');

const dadosValidos = () => ({
    email: 'ana@email.com',
    senha: 'Abcdef1!',
});

beforeEach(async() =>{ usuarios.limpar();
    const senhaHash = await bcrypt.hash('Abcdef1!', 10);

    usuarios.salvar({
        id: 1,
        nome: 'Ana Souza',
        email: 'ana@email.com',
        senhaHash
    });
});


describe('POST /api/login', () => {
    test('login válido retorna 200 e não devolve a senha', async () => {
        const res = await request(app)
            .post('/api/login')
            .send(dadosValidos());
        expect(res.status).toBe(200);
        expect(res.body.usuario.email).toBe('ana@email.com');
        expect(res.body.usuario.senha).toBeUndefined();
        expect(res.body.usuario.senhaHash).toBeUndefined();
    });
    test('senha incorreta retorna 401', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ ...dadosValidos(), senha: 'Errada123!' });
        expect(res.status).toBe(401);
    });
    test('e-mail não cadastrado retorna 401', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ ...dadosValidos(), email: 'outro@email.com' });
        expect(res.status).toBe(401);
    });
    test('e-mail inválido retorna 400', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ ...dadosValidos(), email: 'ana@email' });
        expect(res.status).toBe(400);
    });
    test('senha vazia retorna 400', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ ...dadosValidos(), senha: '' });
        expect(res.status).toBe(400);
    });
});