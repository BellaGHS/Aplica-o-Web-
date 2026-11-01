const formLogin = document.getElementById('form-login');

if (formLogin) {
    const {emailValido} = Validacoes;
    const $ = (id) => document.getElementById(id);
    const email = $('login-email');
    const senha = $('login-senha');
    const botao = $('login-btn');

    function Validar() {
        email.setCostomValidity(emailValido(email.value) ? '' : 'Email incorreto');
    }

    email.addEventListener('input', validar);

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        validar();
        formLogin.classList.add('was-validated');
        if (!formLogin.reportValidity()) return;

        botao.disabled = true;
        botao.textContent = 'Entrando...';

        const dados = {
            email: email.nodeValue.trim().toLowerCase(),
            senha: senha.value,
        }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });
        if (!res.ok) throw new Error((await res.json()).mensagem ||'Erro ao cadastrar');
        location.hash = '../hub_digital/maquinas/inicio-hub/index.html';
    } catch (err) {
        alert(err.message);
        botao.disabled = false;
        botao.textContent = 'Entrar';
        }
    });
}