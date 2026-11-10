document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    const form = document.getElementById('form-editar-perfil');
    const modal = new bootstrap.Modal(
        document.getElementById('modalMensagem')
    );
    const campoFoto = form.querySelector('input[name="foto"]');
    const avatar = document.querySelector('.avatar-editavel .avatar-grande');
    const iconeFoto = avatar.querySelector('i');

    const imagem = document.createElement('img');
    imagem.alt = 'Foto de perfil';
    imagem.style.width = '100%';
    imagem.style.height = '100%';
    imagem.style.objectFit = 'cover';
    imagem.hidden = true;

    avatar.appendChild(imagem);

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

    // Pré-visualização da foto escolhida
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

    function mostrarMensagem(titulo, mensagem) {
        document.getElementById('modalTitulo').textContent = titulo;
        document.getElementById('modalTexto').textContent = mensagem;
        modal.show();
    }
    if (!token) {
        alert('Faça login para acessar seu perfil.');
        return;
    }

    // para carregar os dados
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

        document.getElementById('nome').value = perfil.nome;
        document.getElementById('email').value = perfil.email;
        document.getElementById('telefone').value = perfil.telefone;
        document.getElementById('localizacao').value = perfil.localizacao;
        document.getElementById('sobre').value = perfil.sobre;
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

    // para salvar as alterções
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dados = {
            nomeExibicao: document.getElementById('nomeExibicao').value,
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            localizacao: document.getElementById('localizacao').value,
            sobre: document.getElementById('sobre').value,
        };

        try {
            const dados = new FormData(form);
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

            document.getElementById('modalMensagem').addEventListener('hidden.bs.modal', () => {
                window.location.href = '../perfil-maquina/';
            }, { once: true });

        } catch (erro) {
            mostrarMensagem('Erro ao atualizar perfil', erro.message);
        }
    });
});
