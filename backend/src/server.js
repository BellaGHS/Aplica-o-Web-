const app = require('./app');
const neo4j = require('neo4j-driver');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Usa a porta do ambiente, ou a 3000 se não tiver nenhuma definida
const PORT = process.env.PORT || 3000;

function ConnectToDB () { // função que conecta com o banco de dados
    (async () => {
        const URI = process.env.DB_URI;
        const USER = process.env.DB_USER;
        const PASSWORD = process.env.DB_PASSWORD;
        let driver

        try {
            driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
            await driver.verifyConnectivity()
            console.log('Connection established')
        } catch(err) {
            console.log(`Connection error\n${err}\nCause: ${err.cause}`)
            await driver.close()
            return
        }

        // Use the driver to run queries

        await driver.close()

    })();

}

app.get('/oi', (req, res) => {
  res.send('oi')
})



app.listen(PORT, () => {
  try {
      ConnectToDB()
      console.log(`Servidor rodando em http://localhost:${PORT}`);
  }
catch (e) {
      console.log("Erro: ", e);

  }
});