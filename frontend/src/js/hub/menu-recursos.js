
const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');

const menuRecursos = document.getElementById('menu-recursos');

if (menuRecursos) {
    if (usuario.fornece === 'projeto') {
    menuRecursos.href = '/frontend/src/html/hub_digital/projeto/meus-projetos/index.html';
    menuRecursos.innerHTML = `
        <i class="bi bi-clipboard2-check-fill"></i>
        <span>Meus projetos</span>
    `;
    } else {
        menuRecursos.href = '/frontend/src/html/hub_digital/maquinas/minhas-maquinas/index.html';
        menuRecursos.innerHTML = `
            <i class="bi bi-printer-fill"></i>
            <span>Minhas máquinas</span>
        `;
    }
}
