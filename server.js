const express = require('express');
const cors = require('cors');
const path = require('path');
const { inicializarBanco } = require('./database');
const waitlistRoutes = require('./routes/waitlist');
const errorHandler = require('./middleware/error-handler');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/waitlist', waitlistRoutes);

// Rota raiz — serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de erros (deve ser o último)
app.use(errorHandler);

// Inicializa o banco e sobe o servidor apenas quando executado diretamente
if (require.main === module) {
  inicializarBanco()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
      });
    })
    .catch((erro) => {
      console.error('Falha ao inicializar o banco de dados:', erro.message);
      process.exit(1);
    });
}

module.exports = app;
