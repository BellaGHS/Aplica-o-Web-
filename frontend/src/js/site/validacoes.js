(function (root) {
  function cpfValido(valor) {
    const c = String(valor).replace(/\D/g, '');
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    const dv = (len) => {
      let soma = 0;
      for (let i = 0; i < len; i++) soma += Number(c[i]) * (len + 1 - i);
      const r = (soma * 10) % 11;
      return r === 10 ? 0 : r;
    };
    return dv(9) === Number(c[9]) && dv(10) === Number(c[10]);
  }

  function cnpjValido(valor) {
      let cnpj = String(valor).replace(/[.\/-]/g, '').toUpperCase();
      if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) return false;
      if (/^(\d)\1{13}$/.test(cnpj)) return false;

      let b = [5,4,3,2,9,8,7,6,5,4,3,2];
      let n = 0;

      for (let i = 0; i < 12; i++) {
          n += (cnpj.charCodeAt(i) - 48) * b[i];
      }

      let digito1 = n % 11 < 2 ? 0 : 11 - (n % 11);
      b = [6,5,4,3,2,9,8,7,6,5,4,3,2];
      n = 0;
      for (let i = 0; i < 13; i++) {
          let caractere = i === 12 ? digito1 : cnpj.charCodeAt(i) - 48;
          n += caractere * b[i];
      }
      let digito2 = n % 11 < 2 ? 0 : 11 - (n % 11);
      return cnpj.endsWith(`${digito1}${digito2}`);
  }

  function senhaForte(s) {
    return s.length >= 8 && /[a-z]/.test(s) && /[A-Z]/.test(s) && /\d/.test(s) && /[^A-Za-z0-9]/.test(s);
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor).trim());  }

  const api = { cpfValido, cnpjValido, senhaForte, emailValido };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Validacoes = api;
})(typeof window !== 'undefined' ? window : globalThis);