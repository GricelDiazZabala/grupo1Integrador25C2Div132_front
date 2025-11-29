const btnTema = document.getElementById('cambiar-modo');
const BACKEND_BASE_URL = "http://localhost:3300";
const linkBack = document.getElementById("adminLink");
linkBack.href = BACKEND_BASE_URL;

let carrito = [];

function guardarCarritoSessionStorage() {
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoSessionStorage() {
  const carritoStorage = sessionStorage.getItem("carrito");
  if(carritoStorage) {
    carrito = JSON.parse(carritoStorage);
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
  console.log("Contenido del carrito:", carrito);
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<h2 class="carrito-vacio-msg"> No hay productos en el carrito </h2>`;

    carritoPieDePagina.innerHTML = "";
    return;
  }

  contenedorCarrito.style.display = "block";

  let htmlCarrito = "";
  carrito.forEach((item, indice) => {
    const subtotal = item.precio * item.cantidad;
    const imgSrc = item.img ? `${BACKEND_BASE_URL}${item.img}` : "../img/placeholder.png";

    htmlCarrito += `
      <li class="carrito-item">
          <div class="carrito-producto-info">
            <img src="${imgSrc}" alt="${item.nombre}" class="carrito-img">
              <div class="carrito-detalles">
                  <h3>${item.nombre}</h3>
                  <span class="carrito-tipo">${item.tipo}</span>
                  <span class="carrito-precio-unitario">Precio unitario: $${item.precio}</span>
              </div>
          </div>

          <div class="carrito-producto-acciones">
              <div class="carrito-cantidad-control">
                  <button class="btn-cantidad" onclick="disminuirCantidad(${indice})">-
                  </button>
                  <span class="item-cantidad">${item.cantidad}</span>
                  <button class="btn-cantidad" onclick="aumentarCantidad(${indice})">+
                  </button>
              </div>
              
              <div class="carrito-precio-subtotal">$${subtotal}</div>
              
              <button class="btn-eliminar" onclick="eliminarElemento(${indice})">
              <img src="../img/delete.png" alt="Eliminar" class="icono-eliminar">
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
    guardarCarritoSessionStorage();
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
    guardarCarritoSessionStorage();
    mostrarCarrito();
  }
}

function eliminarElemento(indice) {
  if (
    confirm("¿Estás seguro de que querés eliminar este producto del carrito?")
  ) {
    carrito.splice(indice, 1);
    guardarCarritoSessionStorage();
    mostrarCarrito();
  }
}

function vaciarCarrito() {
  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
    carrito.length = 0;
    guardarCarritoSessionStorage();
    mostrarCarrito();
  }
}

const confirmarCompra = async () => {
  if (!confirm("Deseas confirmar la compra?")) {
    return;
  };

  const nombreUsuario = sessionStorage.getItem('userName') || 'Invitado';

  const datosVenta = {
  nombre_usuario: nombreUsuario,
  productos: carrito.map(item => ({
    id_producto: item.id,       
    cantidad: item.cantidad     
  }))
};

  try {
    const respuesta = await fetch("http://localhost:3300/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosVenta)
    });

    const resultado = await respuesta.json();
    console.log(resultado);

    sessionStorage.setItem("ultimaVenta", JSON.stringify(datosVenta));

    alert("compra finalizada!");
    carrito.length = 0
    guardarCarritoSessionStorage()

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

function initCarrito() {
  cargarTemaGuardado();
  cargarCarritoSessionStorage();
  mostrarCarrito();
}


initCarrito();