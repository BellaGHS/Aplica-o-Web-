const form = document.getElementById('cadastro');

if (form) {
    const $ = (id) => document.getElementById(id);
    const senha = $('cad-senha');
    const confirmar = $('cad-confirmar');
    const cpf = $('cad-cpf');
    const cnpj = $('cad-cnpj');

    function cpfValido(valor) {
        const c = valor.replace(/\D/g, '');
        if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
        const dv = (len) => {
            let soma = 0;
            for (let i = 0; i < len; i++) soma += Number(c[i]) * (len + 1 - i);
            const r = (soma * 10) % 11;
            return r === 10 ? 0 : r;
        };
        return dv(9) === Number(c[9]) && dv(10) === Number(c[10]);
    }
    const cnpjValido = (v) => /^[A-Z0-9]{12}\d{2}$/.teste(v.replace(/[.\/-]/g, '').toUpperCase());

    const senhaForte = (s) => s.length >= 8 && /[a-z]/.test(s) && /[A-Z]/.test(s) && /\d/.test(s) && /[^A-Za-z0-9]/.test(s);

}