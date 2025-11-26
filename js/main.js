const API_BASE_URL = "http://localhost:3306/api/productos";

let contenedorProductos = document.querySelector("#contenedorProductos");
let contenedorCarrito = document.querySelector("#contenedorCarrito");
let barraBusqueda = document.querySelector("#barraBusqueda");
let resumenCarritoTexto = document.querySelector("#resumenCarritoTexto");
let totalPrecioTexto = document.querySelector("#precioTotal");

let termosYmates = [];
let carrito = [];


async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_BASE_URL);
    if (!respuesta.ok) throw new Error("API no disponible");
    
    const data = await respuesta.json();
    termosYmates = data.payload || []; 
    return termosYmates;

  } catch (error) {
    console.warn("No hay datos para mostrar", error);

    return termosYmates;
  }
}

function guardarCarritoLocalStorage() {
  localStorage.setItem("carritoProductos", JSON.stringify(carrito));
}

function cargarCarritoLocalStorage() {
  const carritoGuardado = localStorage.getItem("carritoProductos");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarBarraInferior();
  }
}

function mostrarProductos(array) {
  let cartaProducto = "";
  array.forEach((prod) => {
    const imagen = prod.img_producto || "https://cdn-icons-png.flaticon.com/512/3050/3050253.png"; 
    
    cartaProducto += `
            <div class="card-producto">
                <img src="${imagen}" alt="${prod.nombre_producto}" />
                <h3>${prod.nombre_producto}</h3>
                <p>$ ${prod.precio_producto}</p>
                <button class="botonAgregar" onclick="agregarACarrito(${prod.id})">AGREGAR +</button>
            </div> `;
  });
  contenedorProductos.innerHTML = cartaProducto;
}

barraBusqueda.addEventListener("keyup", (e) => {
    const termino = e.target.value.toLowerCase();
    const filtrados = termosYmates.filter(prod => 
        prod.nombre_producto.toLowerCase().includes(termino)
    );
    mostrarProductos(filtrados);
});

function agregarACarrito(id){
    let prodSeleccionado = termosYmates.find(p => p.id === id);
    if(prodSeleccionado){
        carrito.push(prodSeleccionado);
        guardarCarritoLocalStorage();
        actualizarBarraInferior();
        mostrarCarrito();
    }
}

function actualizarBarraInferior() {
    const total = carrito.reduce((acc, prod) => acc + parseFloat(prod.precio_producto), 0);
    
    resumenCarritoTexto.innerText = `${carrito.length} ítems`;
    totalPrecioTexto.innerText = `$ ${total.toLocaleString()}`;
}

function mostrarCarrito(){
    contenedorCarrito.classList.toggle("hidden");

    let contenidoHTML = "<h3>Tu Pedido</h3><ul>";
    
    if(carrito.length === 0) {
        contenidoHTML += "<p>El carrito está vacío</p>";
    } else {
        carrito.forEach((elemento, indice) => {
            contenidoHTML +=
            `<li class="bloque-item">
                <span class="nombre-item">${elemento.nombre_producto}</span>
                <span class="precio-item">$${elemento.precio_producto}</span>
                <button class="boton-eliminar" onclick="eliminarElemento(${indice})">X</button>
            </li>`;
        });
        contenidoHTML += `</ul><button class='boton-eliminar' style='width:100%; margin-top:10px;' onclick='vaciarCarrito()'> VACIAR TODO </button>`;
    }
    
    contenedorCarrito.innerHTML = contenidoHTML;
}

function eliminarElemento(indice){
    carrito.splice(indice, 1);
    guardarCarritoLocalStorage();
    actualizarBarraInferior();
    mostrarCarrito(); 
}

function vaciarCarrito(){
    carrito = [];
    guardarCarritoLocalStorage();
    actualizarBarraInferior();
    mostrarCarrito();
}

async function init() {
  cargarCarritoLocalStorage();
  const arrayDeProductos = await obtenerProductos();
  mostrarProductos(arrayDeProductos);
}

init();
