const btnTema = document.getElementById('cambiar-modo');

let carrito = [];

function guardarCarritoLocalStorage() {
  localStorage.setItem("carritoProductos", JSON.stringify(carrito));
}

function cargarCarritoLocalStorage() {
  const carritoGuardado = localStorage.getItem("carritoProductos");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}

const contenedorCarrito = document.getElementById("contenedor-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const precioTotalCarrito = document.getElementById("precio-total-carrito");
const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");
const botonConfirmarCompra = document.getElementById("boton-confirmar-compra");
const carritoPieDePagina = document.getElementById("carrito-pie-de-pagina")



function calcularPrecioTotal() {
  if (carrito.length === 0) {
    return 0;
  }
  return carrito.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<h2 class="carrito-vacio-msg"> No hay productos en el carrito </h2>`;

    carritoPieDePagina.innerHTML = ""; 
    return;
  }

  contenedorCarrito.style.display = "block";
  
  let htmlCarrito = "";
  
  carrito.forEach((item, indice) => {    
    const subtotal = item.precio_producto * item.cantidad;

    htmlCarrito += `
      <li class="carrito-item">
          <div class="carrito-producto-info">
              <img src="${item.img_producto || "../img/placeholder.png"}" alt="${item.nombre_producto}" class="carrito-img">
              <div class="carrito-detalles">
                  <h3>${item.nombre_producto}</h3>
                  <span class="carrito-tipo">${item.tipo_producto.toUpperCase()}</span>
                  <span class="carrito-precio-unitario">Precio unitario: $${item.precio_producto}</span>
              </div>
          </div>

          <div class="carrito-producto-acciones">
              <div class="carrito-cantidad-control">
                  <button class="btn-cantidad" onclick="disminuirCantidad(${indice})">
                  </button>
                  <span class="item-cantidad">${item.cantidad}</span>
                  <button class="btn-cantidad" onclick="aumentarCantidad(${indice})">
                  </button>
              </div>
              
              <div class="carrito-precio-subtotal">$${subtotal}</div>
              
              <button class="btn-eliminar" onclick="eliminarElemento(${indice})">
              </button>
          </div>
      </li>
    `;
  });

  listaCarrito.innerHTML = htmlCarrito;

  carritoPieDePagina.innerHTML = `
      <div class="carrito-resumen">
          <div class="resumen-row">
              <span>Total a pagar:</span>
              <span class="resumen-total">$${calcularPrecioTotal()}</span>
          </div>
          <div class="resumen-acciones">
              <button class="btn-vaciar" onclick="vaciarCarrito()">Vaciar Carrito</button>
              <button class="btn-pagar-carrito" onclick="confirmarCompra()">Confirmar Compra</button>
          </div>
      </div>
  `;
}




function aumentarCantidad(indice) {
  if (carrito[indice]) {
    carrito[indice].cantidad += 1;
    guardarCarritoLocalStorage();
    mostrarCarrito();
  }
}

function disminuirCantidad(indice) {
  if (carrito[indice]) {
    if (carrito[indice].cantidad > 1) {
      carrito[indice].cantidad -= 1;
    } else {
      eliminarElemento(indice);
      return;
    }
    guardarCarritoLocalStorage();
    mostrarCarrito();
  }
}

function eliminarElemento(indice) {
  if (
    confirm("¿Estás seguro de que querés eliminar este producto del carrito?")
  ) {
    carrito.splice(indice, 1);
    guardarCarritoLocalStorage();
    mostrarCarrito();
  }
}

function vaciarCarrito() {
  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    carrito.length = 0;
    guardarCarritoLocalStorage();
    mostrarCarrito();
  }
}

const confirmarCompra = async () => {
  if (!confirm("Deseas confirmar la compra?")){
    return;
  } ;

  const nombreUsuario = localStorage.getItem('userName') || 'Invitado';
  
  const datosVenta = {
    fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
    nombre_usuario: nombreUsuario,
    productos: carrito
  };

  try {
    const respuesta = await fetch("http://localhost:3300/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVenta)
    });

    const resultado = await respuesta.json();
    console.log(resultado);

    localStorage.setItem("ultimaVenta", JSON.stringify(datosVenta));
    
    alert("Compra realizada! Andá a la caja con tu ticket a retirarla");
    carrito.length = 0
    guardarCarritoLocalStorage()
    
    window.location.href = 'ticket.html';

  } catch (error) {
    console.error("Error al enviar los datos: ", error);
    alert("Error al procesar la solicitud");
  }
};

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

function initCarrito() {
  cargarCarritoLocalStorage();
  mostrarCarrito();
}


initCarrito();