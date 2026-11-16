
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-projeto');
    const elementoModal = document.getElementById('modalMensagem');
    const modal = new bootstrap.Modal(elementoModal);

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

    function mostrarMensagem(titulo, mensagem) {
        document.getElementById('modalTitulo').textContent = titulo;
        document.getElementById('modalTexto').textContent = mensagem;

        modal.show();

        setTimeout(() => {
            modal.hide();
        }, 2000);
    }

        const token = sessionStorage.getItem('token');

        if (!token) {
            alert('Faça login para cadastrar um projeto.');
            return;
        }

        const botao = form.querySelector('button[type="submit"]');
        botao.disabled = true;
        botao.textContent = 'Cadastrando...';

        const dados = new FormData(form);

        const tipoPeca = [...form.querySelectorAll(
            'input[name="tipo_peca"]:checked'
        )].map(campo => campo.value);

        const materiais = [...form.querySelectorAll(
            'input[name="materiais"]:checked'
        )].map(campo => campo.value);

        const comprimento = dados.get('comprimento');
        const largura = dados.get('largura');
        const altura = dados.get('altura');

        const semDimensoes = dados.get('sem_dimensoes') === '1';

        const dimensoes = semDimensoes
            ? ''
            : [comprimento, largura, altura].join(' x ');

        const localizacao = [
            dados.get('cidade'),
            dados.get('estado')
        ].filter(Boolean).join(' - ');

        const envio = new FormData();

        envio.append('tituloProjeto', dados.get('nome_projeto') || '');
        envio.append('quantidadePecas', dados.get('quantidade') || '');
        envio.append('tipoPeca', tipoPeca.join(', '));
        envio.append('materiais', materiais.join(', '));
        envio.append('descricao', dados.get('descricao') || '');
        envio.append('localizacao', localizacao);
        envio.append('dimensoes', dimensoes);
        envio.append('prazo', dados.get('prazo') || '');
        envio.append('semPrazo', String(dados.get('sem_prazo') === '1'));
        envio.append('disponibilidade', dados.get('disponibilidade') || '');
        envio.append('urgencia', dados.get('urgencia') || '');

        const arquivo = form.querySelector('input[name="arquivo"]').files[0];

        if (arquivo) {
            envio.append('arquivo', arquivo);
        }

        try {
            const res = await fetch('/api/projetos', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: envio
            });

            const resposta = await res.json();

            if (!res.ok) {
                throw new Error(resposta.mensagem || 'Erro ao cadastrar projeto');
            }

            mostrarMensagem(
                'Projeto cadastrado!',
                'Seu projeto foi cadastrado com sucesso.'
            );

            setTimeout(() => {
                window.location.href =
                    '/frontend/src/html/hub_digital/projeto/meus-projetos/';
            }, 2000);

        } catch (err) {
            console.error('Erro ao cadastrar projeto:', err);
            alert(err.message);
        } finally {
            botao.disabled = false;
            botao.textContent = 'Adicionar';
        }
    });
});
