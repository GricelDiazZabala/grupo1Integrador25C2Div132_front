
let logOut = document.getElementById("logOut");

//logica para salir de la pagina principal y borrar el localstorage
logOut.addEventListener("click", (event) => {
    
    event.preventDefault(); 
    localStorage.clear();

    window.location.href = "../index.html";
});



//ToDo : 
// hacer el css para todas las paginas, hacer el html de carrito y factura y sus respectivos css tambien, hacer los fetch y la logica del front end 
// para mostrar los productos, filtrar y agregar al carrito. Hacer la logica del carrito y factura.