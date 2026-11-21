
const { validarSenha } = require(
    '../../src/validar-login-senha'
);

describe('Validação de senha', () => {

    test('Deve aceitar senha válida', () => {
        expect(validarSenha('Abcdef1!')).toBe(true);
    });

    test('Deve rejeitar senha sem letra maiúscula', () => {
        expect(validarSenha('abcdef1!')).toBe(false);
    });

    test('Deve rejeitar senha sem número', () => {
        expect(validarSenha('Abcdefg!')).toBe(false);
    });

    test('Deve rejeitar senha sem caractere especial', () => {
        expect(validarSenha('Abcdef12')).toBe(false);
    });

    test('Deve rejeitar senha menor que 8 caracteres', () => {
        expect(validarSenha('Ab1!')).toBe(false);
    });

    test('Deve rejeitar valores que não sejam strings', () => {
        expect(validarSenha(null)).toBe(false);
    });

});
;