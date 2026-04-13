const request = require('supertest');
const { inicializarBanco, db } = require('../database');

let app;

beforeAll(async () => {
  await inicializarBanco();
  app = require('../server');
  // Limpa registros anteriores para testes consistentes
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM waitlist', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

afterAll((done) => {
  db.close(done);
});

describe('API Volta — Waitlist', () => {
  it('GET /api/waitlist/total deve retornar status 200 e { total: number }', async () => {
    const resposta = await request(app).get('/api/waitlist/total');
    expect(resposta.status).toBe(200);
    expect(typeof resposta.body.total).toBe('number');
  });

  it('POST /api/waitlist com email válido deve retornar status 201 e { sucesso: true }', async () => {
    const resposta = await request(app)
      .post('/api/waitlist')
      .send({ email: 'teste@exemplo.com' });
    expect([200, 201]).toContain(resposta.status);
    expect(resposta.body.sucesso).toBe(true);
  });

  it('POST /api/waitlist com email duplicado deve retornar status 409', async () => {
    const resposta = await request(app)
      .post('/api/waitlist')
      .send({ email: 'teste@exemplo.com' });
    expect(resposta.status).toBe(409);
  });

  it('POST /api/waitlist sem email deve retornar status 400 ou 422', async () => {
    const resposta = await request(app)
      .post('/api/waitlist')
      .send({});
    expect([400, 422]).toContain(resposta.status);
  });

  it('GET / deve retornar status 200', async () => {
    const resposta = await request(app).get('/');
    expect(resposta.status).toBe(200);
  });
});
