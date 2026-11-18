// Conexao com o Neo4j.
//
// Este modulo apenas EXPORTA funcoes: nada acontece ao importa-lo. A versao
// anterior chamava app.listen(3000) no corpo do arquivo, entao o simples
// require subia um segundo servidor e conflitava com o server.js.
//
// Antes de usar:  npm install neo4j-driver dotenv
// E defina no .env da raiz:  DB_URI, DB_USER, DB_PASSWORD

const path = require('path');

let driver = null;

function obterDriver() {
    if (driver) return driver;

    require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });
    const neo4j = require('neo4j-driver');

    const { DB_URI, DB_USER, DB_PASSWORD } = process.env;
    if (!DB_URI || !DB_USER || !DB_PASSWORD) {
        throw new Error('Defina DB_URI, DB_USER e DB_PASSWORD no .env');
    }

    driver = neo4j.driver(DB_URI, neo4j.auth.basic(DB_USER, DB_PASSWORD));
    return driver;
}

async function conectar() {
    const d = obterDriver();
    await d.verifyConnectivity();
    return d;
}

async function fechar() {
    if (!driver) return;
    await driver.close();
    driver = null;
}

module.exports = { obterDriver, conectar, fechar };
