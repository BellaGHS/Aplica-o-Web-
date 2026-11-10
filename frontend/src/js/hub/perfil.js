document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        alert('Faça login para acessar seu perfil.');
        return;
    }


    try {
        const res = await fetch('/api/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const resposta = await res.json();

        if (!res.ok) {
            throw new Error(resposta.mensagem || 'Erro ao carregar perfil');
        }

        const perfil = resposta.perfil;
        const foto = document.getElementById('foto-perfil');
        const icone = document.getElementById('icone-foto');

        if (perfil.fotoPerfil && foto && icone) {
            foto.src = perfil.fotoPerfil;
            foto.hidden = false;
            icone.hidden = true;
        }

        document.getElementById('nome').value = perfil.nome;
        document.getElementById('email').value = perfil.email;
        document.getElementById('telefone').value = perfil.telefone;
        document.getElementById('localizacao').value = perfil.localizacao;

        document.getElementById('texto-sobre').textContent = perfil.sobre;

        document.querySelector('.banner-perfil h1').textContent =
            perfil.banner.titulo;

        document.querySelector('.banner-perfil .tipo').textContent =
            perfil.banner.etiqueta;

        document.querySelector('.banner-perfil p').textContent =
            perfil.banner.subtitulo;

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
        alert(erro.message);
    }
});
