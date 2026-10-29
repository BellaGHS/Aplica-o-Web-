const neo4j = require('neo4j-driver');
const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = express();

function ConnectToDB () {
    (async () => {
        // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
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


app.listen(3000, () => {
    try {
        ConnectToDB()
    }
    catch (e) {
        console.log("Erro: ", e);
    }
})