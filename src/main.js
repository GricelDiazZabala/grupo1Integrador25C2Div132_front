
const API_BASE_URL = "http://localhost:3300/api/productos";

const userDisplay = document.getElementById("user-display");
const productContainer = document.getElementById("product-container");
const logOut = document.getElementById("logOut");
const filterButtons = document.querySelectorAll('.filter-btn');

let todosLosProductos = [];

function mostrarBienvenida() {
    const userName = localStorage.getItem('userName');
    if (userName && userDisplay) {
        userDisplay.textContent = userName;
    }
}

logOut.addEventListener("click", (event) => {
    event.preventDefault(); 
    localStorage.clear();
    window.location.href = "../index.html";
});

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

async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_BASE_URL);
    if (!respuesta.ok) throw new Error("API no disponible");
    
    const data = await respuesta.json();
    todosLosProductos = data.payload || []; 
    mostrarProductos(todosLosProductos);

  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
  }
}

function mostrarProductos(array) {
  let cartaProducto = "";
  if (array.length === 0) {
    productContainer.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }
    
  array.forEach((prod) => {
    cartaProducto += `
        <div class="card-producto">
          <img src="${prod.img_producto || "../img/placeholder.png"}" alt="${prod.nombre_producto}" class="img-producto">
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
                prodSeleccionado,
                cantidad: 1 
            });
        }
        
        guardarCarritoLocalStorage();
        alert(`Se agregó ${prodSeleccionado.nombre_producto} al carrito!`);
    } else {
        console.error("Producto no encontrado con ID:", id);
    }
}


async function init() {
  mostrarBienvenida();
  cargarCarritoLocalStorage();
  await obtenerProductos();
}

init();