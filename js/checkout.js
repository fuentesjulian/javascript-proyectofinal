/* corro la funcion de actualizarHTML cuando carga el DOM */
document.addEventListener("DOMContentLoaded", inicializar());
const carrito = JSON.parse(localStorage.getItem("carrito"));
function inicializar() {
  /* cargo productos */
  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      crearBody();
    });
}

function crearBody() {
  if (carrito?.length > 0) {
    crearCheckout(carrito);
  } else {
    /* si no hay items redirecciona a la pagina de compra */
    window.location.href = "index.html";
  }
}

function crearCheckout(carrito) {
  const itemsCarrito = document.getElementById("itemsCarrito");
  itemsCarrito.innerHTML = "";
  carrito.forEach(({ id, subTotal, cantidad }) => {
    /* voy a necesitar el producto para obtener la foto y el stock */
    const producto = productos.find((producto) => producto.id === id);
    const itemCarrito = document.createElement("li");
    itemCarrito.className = "list-group-item";
    /* uso el input numerico con un max que sea igual al stock */
    itemCarrito.innerHTML = `<div class="imagen"><img src="img/${producto.imagen}" alt="" /></div>
        <div class="texto">
          <div class="nombre">${producto.nombre}</div>
          <div class="precio-unit">Precio unitario $ ${producto.precio.toLocaleString()}</div>
        </div>
        <div class="cantidad">${cantidad}</div>
        <div class="precio" id="subTotal-${id}">$ ${subTotal.toLocaleString()}</div>`;
    itemsCarrito.appendChild(itemCarrito);
  });
  /* ademas de esto tengo que agregar le subtotal */
  const calculoTotal = document.createElement("li");
  calculoTotal.className = "list-group-item";
  /* uso el input numerico con un max que sea igual al stock */
  calculoTotal.innerHTML = `
    <div class="texto">
      <div class="total">Total</div>
    </div>
    <div class="precio" id="total">$ ${(carrito.reduce((acumulador, carrito) => acumulador + carrito["subTotal"], 0)).toLocaleString()}</div>`;
  itemsCarrito.appendChild(calculoTotal);
}
