
const REGRAS_SENHA = [
    /.{8,}/,
    /[A-Z]/,
    /[a-z]/,
    /[0-9]/,
    /[^A-Za-z0-9]/
];

const validarSenha = (senha) =>
    typeof senha === 'string' &&
    REGRAS_SENHA.every((regra) => regra.test(senha));

module.exports = { validarSenha };
