const btnTema = document.getElementById('cambiar-modo');

let welcomeForm = document.getElementById('welcome-form');

welcomeForm.addEventListener('submit', (event) => {

    event.preventDefault();
    const userName = document.getElementById('user-name').value.trim();

    if (userName) {
        sessionStorage.setItem('userName', userName);
        window.location.href = 'pages/productos.html';

    } else {
        alert('Necesitas colocar un nombre para continuar');
    }

});

const aplicarTema = (tema) => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
};

function cambiarModo() {
    const temaActual = document.documentElement.getAttribute('data-theme');
    const nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(nuevoTema);
}

if (btnTema) {
    btnTema.addEventListener('click', cambiarModo);
}

function cargarTemaGuardado() {
    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado) {
        aplicarTema(temaGuardado);
    } else {
        aplicarTema('claro');
    }
}

async function init() {
    cargarTemaGuardado();
}

init();