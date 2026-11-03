const app = require('./app');

// Usa a porta do ambiente, ou a 3000 se não tiver nenhuma definida
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});