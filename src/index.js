//COSNSTANTES
const API_BASE_URL = "http://localhost:3300/api/productos";
//VARIABLES GLOBALES Y ELEMENTOS DOM
let contenedorProductos = document.querySelector("#contenedorProductos");
let contenedorCarrito = document.querySelector("#contenedorCarrito");
let barraBusqueda = document.querySelector("#barraBusqueda");
let resumenCarritoTexto = document.querySelector("#resumenCarritoTexto");
let totalPrecioTexto = document.querySelector("#precioTotal");
const botonCategoria = document.getElementById("catProducto")
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

//funciones del carrito

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

//funciones de filtrado

function filtrarProductos(categoria) {
    let productosFiltrados = [];
    if (categoria === "todos") {
    productosFiltrados = todosLosProductos;
    }else{
      productosFiltrados = todosLosProductos.filter((prod) =>
      prod.tipo === categoria
   );
    }

  mostrarProductos(productosFiltrados);
}

function mostrarProductos(array) {
  let cartaProducto = "";
  array.forEach((prod) => {
    cartaProducto += `
        <div class="card-producto">
          <img src="${prod.img_producto || "img/placeholder.png"}" alt="${prod.nombre_producto}" class="img-producto">
          <h3>${prod.nombre_producto}</h3>
          <p>${prod.tipo_proudcto.toUpperCase()}</p>
          <p>$ ${prod.precio_producto}</p>
          <button class="boton-agregar-a-carrito" onclick="agregarACarrito(${ 
            prod.id 
          })"><img src="http://localhost:3000/img/svg-cart.svg" alt="" srcset="" class="add-cart-svg"></button>
        </div>
      `;      
  });
  contenedorProductos.innerHTML = cartaProducto;
}

function mostrarProductosReordenamiento(productos) {
  const contenedor = document.querySelector("#contenedorProductos");

    contenedor.classList.add("fade-out");

    setTimeout(() => {
      mostrarProductos(productos);

      contenedor.classList.remove("fade-out");

  }, 400); 
}

//para buscar

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

//ordenamientos

function ordenarPorPrecio() {
  const productos = todosLosProductos;
  productos.sort((a, b) => a.precio - b.precio);
  mostrarProductosReordenamiento(productos);
}

function ordenarPorNombre() {
  const productos = todosLosProductos;
  productos.sort((a, b) => {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  });
  mostrarProductosReordenamiento(productos);
}


botonCategoria.addEventListener("click", event => {
  filtrarProductos(event.target.value);
});

botonOrdenarNombre.addEventListener("click", ordenarPorNombre);

botonOrdenarPrecio.addEventListener("click", ordenarPorPrecio);


async function init() {
  cargarCarritoLocalStorage();
  const arrayDeProductos = await obtenerProductos();
  mostrarProductos(arrayDeProductos);
}

init();
