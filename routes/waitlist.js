const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Registra email na waitlist
router.post('/', (req, res, next) => {
  const { email, source } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ sucesso: false, mensagem: 'Email inválido ou ausente.' });
  }

  const origem = source || 'hero';

  const sql = `INSERT INTO waitlist (email, source) VALUES (?, ?)`;

  db.run(sql, [email.trim().toLowerCase(), origem], function (erro) {
    if (erro) {
      if (erro.message && erro.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ sucesso: false, mensagem: 'Este email já está cadastrado na waitlist.' });
      }
      return next(erro);
    }
    return res.status(201).json({ sucesso: true, mensagem: 'Email cadastrado com sucesso! Você está na lista.' });
  });
});

// Registra interesse em uma feature específica
router.post('/interesse', (req, res, next) => {
  const { email, feature_slug } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ sucesso: false, mensagem: 'Email inválido ou ausente.' });
  }

  if (!feature_slug || typeof feature_slug !== 'string' || feature_slug.trim() === '') {
    return res.status(400).json({ sucesso: false, mensagem: 'feature_slug é obrigatório.' });
  }

  const sql = `INSERT INTO interesse_features (email, feature_slug) VALUES (?, ?)`;

  db.run(sql, [email.trim().toLowerCase(), feature_slug.trim()], function (erro) {
    if (erro) {
      return next(erro);
    }
    return res.status(201).json({ sucesso: true });
  });
});

// Retorna total de emails cadastrados na waitlist
router.get('/total', (req, res, next) => {
  const sql = `SELECT COUNT(*) AS total FROM waitlist`;

  db.get(sql, [], (erro, linha) => {
    if (erro) {
      return next(erro);
    }
    return res.json({ total: linha.total });
  });
});

module.exports = router;
