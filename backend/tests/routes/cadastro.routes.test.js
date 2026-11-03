const request = require('supertest');
const app = require('../../src/app');
const usuarios = require('../../src/shared/repositories/usuarios.repository');

// Dados que passam em todas as validações
const dadosValidos = () => ({
  nome: 'Ana Souza',
  cpf: '52998224725',
  telefone: '11999998888',
  email: 'ana@email.com',
  senha: 'Abcdef1!',
  cnpj: '11222333000181',
  razaoSocial: 'Instituição Ana',
  fornece: 'maquina',
});

// Antes de cada teste, esvazia a lista de usuários
beforeEach(() => usuarios.limpar());

describe('POST /api/cadastro', () => {
  test('cadastro válido retorna 201 e não devolve a senha', async () => {
    const res = await request(app).post('/api/cadastro').send(dadosValidos());
    expect(res.status).toBe(201);
    expect(res.body.usuario.email).toBe('ana@email.com');
    expect(res.body.usuario.senha).toBeUndefined();
  });

  test('a senha é guardada com hash, nunca em texto', async () => {
    await request(app).post('/api/cadastro').send(dadosValidos());
    const salvo = usuarios.buscarPorEmail('ana@email.com');
    expect(salvo.senhaHash).toBeDefined();
    expect(salvo.senhaHash).not.toBe('Abcdef1!');
    expect(salvo.senha).toBeUndefined();
  });

  test('CPF inválido retorna 400', async () => {
    const res = await request(app).post('/api/cadastro').send({ ...dadosValidos(), cpf: '11111111111' });
    expect(res.status).toBe(400);
    expect(res.body.mensagem).toMatch(/CPF/);
  });

  test('senha fraca retorna 400', async () => {
    const res = await request(app).post('/api/cadastro').send({ ...dadosValidos(), senha: 'abc123' });
    expect(res.status).toBe(400);
  });

  test('e-mail inválido retorna 400', async () => {
    const res = await request(app).post('/api/cadastro').send({ ...dadosValidos(), email: 'ana@email' });
    expect(res.status).toBe(400);
  });

  test('campo obrigatório faltando retorna 400', async () => {
    const dados = dadosValidos();
    delete dados.nome;
    const res = await request(app).post('/api/cadastro').send(dados);
    expect(res.status).toBe(400);
  });

  test('fornece diferente de maquina ou projeto retorna 400', async () => {
    const res = await request(app).post('/api/cadastro').send({ ...dadosValidos(), fornece: 'outro' });
    expect(res.status).toBe(400);
  });

  test('e-mail repetido retorna 409', async () => {
    await request(app).post('/api/cadastro').send(dadosValidos());
    const res = await request(app).post('/api/cadastro').send(dadosValidos());
    expect(res.status).toBe(409);
  });

  test('CPF repetido com outro e-mail retorna 409', async () => {
    await request(app).post('/api/cadastro').send(dadosValidos());
    const res = await request(app).post('/api/cadastro').send({ ...dadosValidos(), email: 'outra@email.com' });
    expect(res.status).toBe(409);
  });
});