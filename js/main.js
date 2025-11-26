const API_BASE_URL = "http://localhost:3306/api/productos";

let contenedorProductos = document.querySelector("#contenedorProductos");
let contenedorCarrito = document.querySelector("#contenedorCarrito");
let barraBusqueda = document.querySelector("#barraBusqueda");
let nav = document.querySelector("nav");
let termosYmates = [];
let carrito = [];

async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_BASE_URL);
   
    const productos = await respuesta.json();

    console.log("Datos de los productos API:", productos);
    if(!productos){
      termosYmates = [];
    }
    termosYmates = productos.payload

    return termosYmates;

  } catch (error) {
    console.error("Hubo un error al obtener los productos:", error);
    return [];
  }
}

function guardarCarritoLocalStorage() {
  localStorage.setItem("carritoProductos", JSON.stringify(carrito));
}

function cargarCarritoLocalStorage() {
  const carritoGuardado = localStorage.getItem("carritoProductos");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
}

function mostrarProductos(array) {
  let cartaProducto = "";
  array.forEach((prod) => {
    cartaProducto += `
            <div class="card-producto">
                <img src="${prod.img_producto || "img/placeholder.png"}" alt="${prod.nombre_producto}" />
                <h3>${prod.nombre_producto}</h3>
                <p>$ ${prod.precio_producto}</p>
                <button class="botonAgregar" onclick="agregarACarrito(${prod.id})">Agregar a carrito</button>
            </div> `;
  });
  contenedorProductos.innerHTML = cartaProducto;
}

barraBusqueda.addEventListener("keyup", () => {
    filtrarProductos();
});
/*
function filtrarProductos(categoria) {
    let productosFiltrados = [];
    if (categoria === "todos") {
    productosFiltrados = todosLosProductos;
    }else{
      productosFiltrados = todosLosProductos.filter((prod) =>
      juego.tipo === categoria
   );
    }

  mostrarProductos(productosFiltrados);
}
*/
function agregarACarrito(id){
    let prodSeleccionado = productos.find(p => p.id === id);
    carrito.push(prodSeleccionado);
    mostrarCarrito();
    localStorage.setItem("carrito", carrito);
}

function mostrarCarrito(){
    let cartaCarrito = "<ul>";
    carrito.forEach((elemento, indice) => {
        cartaCarrito +=
        `<li class="bloque-item">
            <p class="nombre-item">${elemento.nombre_producto} - $ ${elemento.precio_producto}</p>
            <p class="nombre-item">${indice}</p>
            <button class="boton-eliminar" onclick="eliminarElemento(${indice})">Eliminar</button>
        </li>`
        
    });

    cartaCarrito += "</ul><button class='boton-eliminar' onclick='vaciarCarrito()'> Vaciar carrito </button>";
    contenedorCarrito.innerHTML = cartaCarrito;

    console.log(carrito);
}

function eliminarElemento(indice){
    carrito.splice(indice, 1);
    mostrarCarrito(); 
}

function vaciarCarrito(){
    carrito = [];
    contenedorCarrito.innerHTML = "";
}

async function init() {
  cargarCarritoLocalStorage();
  const arrayDeProductos = await obtenerProductos();

  if (arrayDeProductos && arrayDeProductos.length > 0) {
    mostrarProductos(arrayDeProductos);
  } else {
    console.error("No se pudo obtener o el array está vacío.");
  }
}

init();
