const btnTema = document.getElementById('cambiar-modo');

function cargarTicket() {
    const datosVentaJSON = sessionStorage.getItem("ultimaVenta");
    const contenedorTicket = document.getElementById("contenedor-ticket");
    
    if (!datosVentaJSON) {
        contenedorTicket.innerHTML = "<h2>No se encontraron detalles de la última compra.</h2>";
        return;
    }

    const datosVenta = JSON.parse(datosVentaJSON);
    
    let total = 0;
    let listaProductosHTML = datosVenta.productos.map(item => {
        const subtotal = item.precio_producto * item.cantidad;
        total += subtotal;
        return `
            <li>
                <span>${item.nombre_producto} (${item.tipo_producto.toUpperCase()})</span>
                <span>${item.cantidad} x $${item.precio_producto} = <strong>$${subtotal.toFixed(2)}</strong></span>
            </li>
        `;
    }).join('');

    const TicketHTML = `
        <div class="ticket-header">
            <p><strong>Cliente:</strong> ${datosVenta.nombre_usuario}</p>
            <p><strong>Fecha:</strong> ${new Date(datosVenta.fecha).toLocaleDateString()} ${new Date(datosVenta.fecha).toLocaleTimeString()}</p>
            <hr>
        </div>
        <h3>Productos Comprados:</h3>
        <ul class="lista-productos-ticket">${listaProductosHTML}</ul>
        <hr>
        <div class="ticket-total">
            <h2>TOTAL: $${total.toFixed(2)}</h2>
        </div>
        <p class="mensaje-final">¡Gracias por tu compra! Tu ticket de retiro es esta ticket.</p>
    `;
    
    contenedorTicket.innerHTML = ticketHTML;
    
    localStorage.removeItem("ultimaVenta"); 
}


document.addEventListener('DOMContentLoaded', cargarTicket);

const aplicarTema = (tema) => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
};

function cambiarModo() {
    const temaActual = document.documentElement.getAttribute('data-theme');
    const nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(nuevoTema);
}

if(btnTema) {
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
