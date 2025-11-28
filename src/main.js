
const API_BASE_URL = "http://localhost:3300/api/products";
const imgUrl = "http://localhost:3300";

const userDisplay = document.getElementById("user-display");
const productContainer = document.getElementById("product-container");
const logOut = document.getElementById("logOut");
const filterButtons = document.querySelectorAll('.filter-btn');
const ordenarNombreBtn = document.getElementById('ordenar-por-nombre');
const ordenarPrecioBtn = document.getElementById('ordenar-por-precio');
const carritoCounter = document.getElementById('carrito-counter');

let todosLosProductos = [];
let productosMostrados = [];

//funciones del carrito 

let carrito = [];


function guardarCarritoLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

//funcion para mostrar la bienvenida al usuario
function mostrarBienvenida() {
    const userName = localStorage.getItem('userName');
    if (userName && userDisplay) {
        userDisplay.textContent = userName;
    }else {
        userDisplay.textContent = "Invitado";
    }
}

//funcion para cerrar sesion
logOut.addEventListener("click", (event) => {
    event.preventDefault(); 
    localStorage.clear(); //aca vacia el localstorage asi que el carrito tambien se vacia
    window.location.href = "../index.html";
});


//funcion para retornar el carrito desde el localstorage si existe
function cargarCarritoLocalStorage() {
  const carritoStorage = localStorage.getItem("carrito");
  if(carritoStorage) {
    carrito = JSON.parse(carritoStorage);
  }
}

//funcion para obtener los productos desde la API
async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_BASE_URL);
    if (!respuesta.ok) throw new Error("API no disponible");
    
    const data = await respuesta.json();
    todosLosProductos = Array.isArray(data.payload) ? data.payload : data;
    mostrarProductos(todosLosProductos);

  } catch (error) {
    productContainer.innerHTML = "<p>Error al cargar productos. Intenta mas tarde.</p>";
    console.error("No se pudieron cargar los productos:", error);
  }
}

// funcion para mostrar los productos en el contenedor y crear las cartas dinamicamente
function mostrarProductos(array) {
  productosMostrados = array;
  let cartaProducto = "";
  if (array.length === 0) {
    productContainer.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }
    
  array.forEach((prod) => {
    cartaProducto += `
        <div class="card-producto">
          <img src="${imgUrl}${prod.img_producto || "../img/placeholder.png"}" alt="${prod.nombre_producto}" class="img-producto">
          <h3>${prod.nombre_producto}</h3>
          <p>${prod.tipo_producto.toUpperCase()}</p>
          <p>$ ${prod.precio_producto}</p>
          <button class="boton-agregar-a-carrito" onclick="agregarACarrito(${ 
            prod.id 
          })">Agregar</button>
        </div>
      `;      
  });
  productContainer.innerHTML = cartaProducto;
}

// funcion para filtrar los productos por categoria

function filtrarProductos(categoria) {
    let productosFiltrados = [];
    if (categoria === "todos") {
        productosFiltrados = todosLosProductos;
    } else {
        productosFiltrados = todosLosProductos.filter((prod) =>
            prod.tipo_producto.toLowerCase() === categoria 
        );
    }
    mostrarProductos(productosFiltrados);
}

// eventos para los botones de filtro
filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        const categoria = event.target.id;
        filtrarProductos(categoria);
    });
});


function agregarACarrito(id){
    const prodSeleccionado = todosLosProductos.find(p => p.id === id);
    if(prodSeleccionado){

        const itemEnCarrito = carrito.find(item => item.id === id);

        if (itemEnCarrito) {
            itemEnCarrito.cantidad += 1;
        } else {
  
          carrito.push({
          id: prodSeleccionado.id,
          nombre: prodSeleccionado.nombre_producto,
          tipo: prodSeleccionado.tipo_producto,
          precio: prodSeleccionado.precio_producto,
          img: prodSeleccionado.img_producto,
          cantidad: 1,
    });
  }       
        guardarCarritoLocalStorage();
        actualizarContadorCarrito();
        alert(`Se agregó ${prodSeleccionado.nombre_producto} al carrito!`);
    } else {
        console.error("Producto no encontrado con ID:", id);
    }
}


function actualizarContadorCarrito() {
    const totalCarrito = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    carritoCounter.textContent = totalCarrito;
}

// eventos para los botones de ordenamiento
ordenarNombreBtn.addEventListener('click', ordenarPorNombre);
ordenarPrecioBtn.addEventListener('click', ordenarPrecio);


function ordenarPrecio() {
  const productosOrdenados = [...productosMostrados];
  productosOrdenados.sort((a, b) => a.precio_producto - b.precio_producto);
  mostrarProductos(productosOrdenados);
}

function ordenarPorNombre(){
  const productosOrdenados = [...productosMostrados];
  productosOrdenados.sort((a, b) => a.nombre_producto.toLowerCase().localeCompare(b.nombre_producto.toLowerCase()));
  mostrarProductos(productosOrdenados);
}





async function init() {
  mostrarBienvenida();
  cargarCarritoLocalStorage();
  await obtenerProductos();
  
}

init();