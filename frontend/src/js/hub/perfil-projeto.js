
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

        // Foto de perfil
        const foto = document.getElementById('foto-perfil');
        const icone = document.getElementById('icone-foto');

        if (perfil.fotoPerfil && foto && icone) {
            foto.src = perfil.fotoPerfil;
            foto.hidden = false;
            icone.hidden = true;
        }

        // Informações pessoais
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const telefone = document.getElementById('telefone');
        const localizacao = document.getElementById('localizacao');
        const sobre = document.getElementById('texto-sobre');

        if (nome) nome.value = perfil.nome || '';
        if (email) email.value = perfil.email || '';
        if (telefone) telefone.value = perfil.telefone || '';
        if (localizacao) localizacao.value = perfil.localizacao || '';
        if (sobre) sobre.textContent = perfil.sobre || '';

        // Banner do perfil
        const titulo = document.querySelector('.banner-perfil h1');
        const tipo = document.querySelector('.banner-perfil .tipo');
        const subtitulo = document.querySelector('.banner-perfil p');

        if (titulo) {
            titulo.textContent = perfil.banner?.titulo || '';
        }

        if (tipo) {
            tipo.textContent = perfil.banner?.etiqueta || '';
        }

        if (subtitulo) {
            subtitulo.textContent = perfil.banner?.subtitulo || '';
        }

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
        alert(erro.message);
    }
});
