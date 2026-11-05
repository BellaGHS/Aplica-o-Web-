const formLogin = document.getElementById('form-login');

if (formLogin) {
    const $ = (id) => document.getElementById(id);
    const { emailValido } = Validacoes;
    const email = $('login-email');
    const senha = $('login-senha');
    const botao = $('entrar-btn');

    function validar() {
        email.setCustomValidity(emailValido(email.value) ? '' : 'E-mail incorreto'); 
    }

    email.addEventListener('input', validar);

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        validar();

        if (!formLogin.reportValidity()) return;

        botao.disabled = true;
        botao.textContent = 'Entrando...';

        const dados = {
            email: email.value.trim().toLowerCase(),
            senha: senha.value
        };

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        const resposta = await res.json();

        if (!res.ok){
            throw new Error(resposta.mensagem ||'Erro ao entrar');
        }
        location.href = '../hub_digital/maquinas/inicio-hub/index.html';
    } catch (err) {
        alert(err.message);
        botao.disabled = false;
        botao.textContent = 'Entrar';
        }
    });
}