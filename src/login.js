let welcomeForm = document.getElementById('welcome-form');

welcomeForm.addEventListener('submit', (event) => {
    
    event.preventDefault();
    const userName = document.getElementById('user-name').value.trim();
    
    if (userName) {
        localStorage.setItem('userName', userName);
        window.location.href = '../pages/productos.html';
    
    } else {
        alert('Necesitas colocar un nombre para continuar');
    }

});