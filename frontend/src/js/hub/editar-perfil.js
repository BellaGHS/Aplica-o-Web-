
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    const form = document.getElementById('form-editar-perfil');

    const modalElemento = document.getElementById('modalMensagem');
    const modal = new bootstrap.Modal(modalElemento);

    if (!token) {
        alert('Faça login para acessar seu perfil.');
        return;
    }

    const campoFoto = form.querySelector('input[name="foto"]');
    const avatar = document.querySelector('.avatar-editavel .avatar-grande');
    const iconeFoto = avatar.querySelector('i');
    const imagem = document.getElementById('preview-foto');

    // Exibir mensagens no pop-up
    function mostrarMensagem(titulo, mensagem) {
        document.getElementById('modalTitulo').textContent = titulo;
        document.getElementById('modalTexto').textContent = mensagem;

        modal.show();

        setTimeout(() => {
            modal.hide();
        }, 2000);
    }

    // Exibir foto
    function exibirFoto(caminho) {
        if (caminho) {
            imagem.src = caminho;
            imagem.hidden = false;
            iconeFoto.hidden = true;
        } else {
            imagem.hidden = true;
            iconeFoto.hidden = false;
        }
    }

    // Pré-visualização da foto
    campoFoto.addEventListener('change', () => {
        const arquivo = campoFoto.files[0];

        if (!arquivo) return;

        if (!arquivo.type.startsWith('image/')) {
            mostrarMensagem('Arquivo inválido', 'Selecione uma imagem.');
            campoFoto.value = '';
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            mostrarMensagem('Imagem muito grande', 'Escolha uma imagem de até 5 MB.');
            campoFoto.value = '';
            return;
        }

        const url = URL.createObjectURL(arquivo);
        exibirFoto(url);
    });

    // Carregar os dados do perfil
    try {
        const res = await fetch('/api/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const resposta = await res.json();

        if (!res.ok) {
            throw new Error(resposta.mensagem || 'Erro ao carregar perfil.');
        }

        const perfil = resposta.perfil;

        exibirFoto(perfil.fotoPerfil);

        document.getElementById('nome').value = perfil.nome || '';
        document.getElementById('email').value = perfil.email || '';
        document.getElementById('telefone').value = perfil.telefone || '';
        document.getElementById('localizacao').value = perfil.localizacao || '';
        document.getElementById('sobre').value = perfil.sobre || '';
        document.getElementById('nomeExibicao').value = perfil.nomeExibicao || '';

        document.querySelector('.banner-perfil h1').textContent =
            perfil.banner.titulo;

        document.querySelector('.banner-perfil .tipo').textContent =
            perfil.banner.etiqueta;

        document.querySelector('.banner-perfil p').textContent =
            perfil.banner.subtitulo;

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
        mostrarMensagem('Erro ao carregar perfil', erro.message);
        return;
    }

    // Salvar alterações
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dados = new FormData(form);

        try {
            const res = await fetch('/api/perfil', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: dados
            });

            const resposta = await res.json();

            if (!res.ok) {
                throw new Error(resposta.mensagem || 'Erro ao atualizar perfil.');
            }

            mostrarMensagem(
                'Perfil atualizado!',
                'Suas informações foram salvas com sucesso.'
            );

            // Redirecionar após o fechamento automático
            setTimeout(() => {
                window.location.href = '../perfil-maquina/';
            }, 2000);

        } catch (erro) {
            console.error('Erro ao atualizar perfil:', erro);
            mostrarMensagem('Erro ao atualizar perfil', erro.message);
        }
    });
});
