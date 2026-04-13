const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const caminhoBanco = path.join(__dirname, 'banco.db');

const db = new sqlite3.Database(caminhoBanco, (erro) => {
  if (erro) {
    console.error('Erro ao conectar ao banco de dados:', erro.message);
    process.exit(1);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

function inicializarBanco() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS waitlist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          source TEXT DEFAULT 'hero',
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (erro) => {
        if (erro) {
          reject(new Error('Erro ao criar tabela waitlist: ' + erro.message));
          return;
        }
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS interesse_features (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          feature_slug TEXT NOT NULL,
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (erro) => {
        if (erro) {
          reject(new Error('Erro ao criar tabela interesse_features: ' + erro.message));
          return;
        }
        resolve();
      });
    });
  });
}

module.exports = { db, inicializarBanco };
