const btnTema = document.getElementById('cambiar-modo');


/**
    Renderiza el ticket de compra en el DOM.
    Obtiene los datos de la ultima venta desde sessionStorage.
    Genera HTML con cliente, fecha, productos y total.
    Muestra un mensaje si no hay datos.
 */
function cargarTicket() {
    const datosVentaJSON = sessionStorage.getItem("ultimaVenta");
    const contenedorTicket = document.getElementById("contenedor-ticket");

    if (!datosVentaJSON) {
        contenedorTicket.innerHTML = "<h2>No se encontraron detalles de la última compra.</h2>";
        return;
    }

    const datosVenta = JSON.parse(datosVentaJSON);
    console.log("Datos de venta recibidos:", datosVenta); // todo : borrar este console log luego de testear

    let total = 0;
    let listaProductosHTML = datosVenta.productos.map(item => {

        const precio = item.precio_unitario
        const subtotal = precio * item.cantidad;
        total += subtotal;

        return `
            <li class="producto-ticket">
                <div class="producto-info">
                    <span class="producto-nombre">${item.nombre_producto || `Producto ${item.id_producto}`}</span>
                    <span class="producto-tipo">${item.tipo_producto ? item.tipo_producto.toUpperCase() : ''}</span>
                </div>
                <div class="producto-precios">
                    <span>${item.cantidad} x $${precio}</span>
                    <strong>$${subtotal.toFixed(2)}</strong>
                </div>
            </li>
        `;
    }).join('');

    const ticketHTML = `
        <div class="ticket">
            <div class="ticket-header">
                <h2>Ticket de Compra</h2>
                <p><strong>Cliente:</strong> ${datosVenta.cliente}</p>
                <p><strong>Fecha:</strong> ${new Date(datosVenta.fecha).toLocaleDateString()} ${new Date(datosVenta.fecha).toLocaleTimeString()}</p>
                <p><strong>N° de Venta:</strong> ${datosVenta.venta_id}</p>
                <hr>
            </div>
            
            <div class="ticket-productos">
                <h3>Productos Comprados:</h3>
                <ul class="lista-productos-ticket">${listaProductosHTML}</ul>
            </div>
            
            <hr>
            <div class="ticket-total">
                <h2>TOTAL: $${datosVenta.total.toFixed(2)}</h2>
            </div>
            
            <div class="ticket-footer">
                <p class="mensaje-final">¡Gracias por tu compra! Presentá este ticket para retirar tu pedido.</p>
            </div>
        </div>
    `;

    contenedorTicket.innerHTML = ticketHTML;

}

/**
    Reinicia el sistema:
    Limpia sessionStorage y localStorage.
    Redirige al index.html.
 */
function reiniciarSistema() {

    sessionStorage.clear();
    localStorage.clear();
    
    window.location.href = '../index.html';
}

/**
    Aplica un tema (claro u oscuro) y lo guarda en localStorage.
    Parametro : tema - Nombre del tema ('claro' u 'oscuro').
 */
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

//funcion inicializadora
async function init() {
    cargarTemaGuardado();
    cargarTicket(); 
    setTimeout(() => reiniciarSistema(), 10000);
}

document.addEventListener('DOMContentLoaded', init);