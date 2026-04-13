// Middleware centralizado de tratamento de erros
function errorHandler(err, req, res, next) {
  console.error('Erro na requisição:', err.message || err);

  const status = err.status || err.statusCode || 500;
  const mensagem = err.mensagem || err.message || 'Erro interno do servidor.';

  res.status(status).json({
    sucesso: false,
    mensagem: status === 500 ? 'Erro interno do servidor.' : mensagem,
  });
}

module.exports = errorHandler;
