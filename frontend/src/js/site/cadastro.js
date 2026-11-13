const form = document.getElementById('cadastro');

if (form) {
    const { cpfValido, cnpjValido, senhaForte, emailValido  } = Validacoes;

    const $ = (id) => document.getElementById(id);
    const email = $('cad-email');  
    const senha = $('cad-senha');
    const confirmar = $('cad-confirmar');
    const cpf = $('cad-cpf');
    const cnpj = $('cad-cnpj');

    function validar() {
        email.setCustomValidity(emailValido(email.value) ? '' : 'E-mail inválido'); 
        cpf.setCustomValidity(cpfValido(cpf.value) ? '' : 'CPF inválido');
        cnpj.setCustomValidity(cnpjValido(cnpj.value) ? '' : 'CNPJ inválido');
        senha.setCustomValidity(
        senhaForte(senha.value) ? '' : 'Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo');
        confirmar.setCustomValidity(confirmar.value === senha.value ? '' : 'As senhas não coincidem');
    }

    [cpf, cnpj, senha, confirmar, email].forEach((el) => el.addEventListener('input', validar));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        validar();
        form.classList.add('was-validated');
        if (!form.reportValidity()) return;

        const botao = $('criar-btn');
        botao.disabled = true;
        botao.textContent = 'Criando...';

        const dados = {
        nome: $('cad-nome').value.trim(),
        cpf: cpf.value.replace(/\D/g, ''),
        telefone: $('cad-telefone').value.trim(),
        email: $('cad-email').value.trim().toLowerCase(),
        senha: senha.value,
        cnpj: cnpj.value.replace(/[.\/-]/g, ''),
        razaoSocial: $('cad-razao').value.trim(),
        fornece: $('fornecer').value,
        termos: $('termos').checked,
    };
    console.log('Opção selecionada:', $('fornecer').value);

    try {
        const res = await fetch('/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        if (!res.ok) throw new Error((await res.json()).mensagem || 'Erro ao cadastrar');
        location.hash = '#login';
    } catch (err) {
        alert(err.message);
        botao.disabled = false;
        botao.textContent = 'Criar';
        }
    });
}