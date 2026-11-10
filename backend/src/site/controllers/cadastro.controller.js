// Papel: só tradus. Pega a requisição, entrega ao service, e transfoma o resultado ou erro em resposta HTTP.

const service = require('../services/cadastro.service');

//req=o que chegou do front | res=o que vamos responder
async function cadastrar(req, res) {
    try {
        //req.body são os dados que o front enviou(o express.json() já transformou em objeto)
        const usuario = await service.cadastrar(req.body);

        //201 = "criado com sucesso"
        res.status(201).json({mensagem: 'Cadastro realizado com sucesso', usuario});   
    } catch (err) {
        // Se o erro tem "status", fomos nós que criamos (400 ou 409): devolve a mensagem dele
        if (err.status) return res.status(err.status).json({mensagem: err.message});

         // Qualquer outro erro é falha nossa. Mostramos no terminal para você ver,
    // mas ao usuário não revelamos os detalhes (por segurança).
    console.error(err);
    res.status(500).json({mensagem: 'Erro interno do servidor'});
    }
}

module.exports = { cadastrar };

// (201) criado, 
// (400) dado inválido, 
// (409) repetido, 
// (500) erro do servidor.