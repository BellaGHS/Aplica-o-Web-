  const { cpfValido, cnpjValido, senhaForte, emailValido } = require('../src/js/site/validacoes');

  describe('cpfValido', () => {
    test('aceita CPF válido, com ou sem máscara', () => {
      expect(cpfValido('529.982.247-25')).toBe(true);
      expect(cpfValido('52998224725')).toBe(true);
    });

    test('rejeita dígito verificador errado', () => {
      expect(cpfValido('529.982.247-24')).toBe(false);
    });

    test('rejeita todos os dígitos iguais', () => {
      expect(cpfValido('111.111.111-11')).toBe(false);
    });

    test('rejeita tamanho errado e vazio', () => {
      expect(cpfValido('123')).toBe(false);
      expect(cpfValido('')).toBe(false);
    });
  });

  describe('cnpjValido', () => {
    test('aceita CNPJ numérico e alfanumérico', () => {
      expect(cnpjValido('11.222.333/0001-81')).toBe(true);
      expect(cnpjValido('12.ABC.345/01DE-35')).toBe(true);
    });

    test('rejeita tamanho errado', () => {
      expect(cnpjValido('1122233300018')).toBe(false);
      expect(cnpjValido('')).toBe(false);
    });

    test('rejeita letras nos dois últimos dígitos', () => {
      expect(cnpjValido('112223330001AB')).toBe(false);
    });
  });

  describe('senhaForte', () => {
    test('aceita senha completa', () => {
      expect(senhaForte('Abcdef1!')).toBe(true);
    });
    

  describe('emailValido', () => {
  test('aceita e-mail válido', () => {
    expect(emailValido('ana@email.com')).toBe(true);
  });

  test.each(['', 'ana', 'ana@', 'ana@email', '@email.com', 'ana @email.com'])(
    'rejeita "%s"',
    (valor) => {
      expect(emailValido(valor)).toBe(false);
    }
  );
});

    test.each([
      ['curta demais', 'Ab1!'],
      ['sem maiúscula', 'abcdefg1!'],
      ['sem minúscula', 'ABCDEFG1!'],
      ['sem número', 'Abcdefgh!'],
      ['sem símbolo', 'Abcdefg1'],
    ])('rejeita senha %s', (_descricao, senha) => {
      expect(senhaForte(senha)).toBe(false);
    });
  });