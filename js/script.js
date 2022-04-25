/* para simplificar el código puse sólo un array de productos sin la master data */
let productos = [];
productos[0] = { id: "PR5", nombre: "Procesador Ryzen 5", precio: 35000, stock: 5, descripcion: "Procesador Ryzen 5 3900x", imagen: "ryzen5.png" };
productos[1] = { id: "PR7", nombre: "Procesador Ryzen 7", precio: 65000, stock: 2, descripcion: "Procesador Ryzen 7 5800x", imagen: "ryzen7.png" };
productos[2] = { id: "PI5", nombre: "Procesador Intel I5", precio: 37000, stock: 4, descripcion: "Procesador Intel i5 10ma generacion", imagen: "i5.png" };
productos[3] = { id: "PI7", nombre: "Procesador Intel I7", precio: 67000, stock: 4, descripcion: "Procesador Intel i7 10ma generacion", imagen: "i7.png" };
productos[4] = { id: "MOA", nombre: "Motherboard Asus", precio: 45000, stock: 2, descripcion: "Motherboard Asus Gamer Z590-e", imagen: "asus.png" };
productos[5] = { id: "MOG", nombre: "Motherboard Gigabyte", precio: 25000, stock: 2, descripcion: "Mothherboard Gigabyte Z690", imagen: "gigabyte.png" };

/* es un numero de factura que va subiendo a medida que voy facturando */
let numeroFact = 0;

/* esta función sirve para cargar los productos al HTML */
function cargarProductos() {
  const articulos = document.getElementById("articulos");
  /* volvi a la version anterior de carga, es mas corto el codigo */
  articulos.innerHTML = "";
  productos.forEach((producto) => {
    /* agrego cada producto al articulo dentro del body en el html */
    const plantilla = document.createElement("div");
    plantilla.className = "card";
    plantilla.innerHTML = `
      <h5 class="titulo">${producto.nombre}</h5>
      <div class="imagen"><img src="img/${producto.imagen}" class="card-img-top" alt="..."></div>
      <div class="card-body">
        <p class="precio">$ ${producto.precio.toLocaleString()}</p>
        <p class="card-text descripcion">${producto.descripcion}</p>
        <p class="card-text">ID: ${producto.id}</p>
        <p class="card-text" id="stock-${producto.id}">Stock: ${producto.stock}</p>
        <button class="btn btn-dark" id="agregar-${producto.id}">Agregar</button>
      </div>`;
    articulos.appendChild(plantilla);
    /* cuando hago click corro la instrucion agregarProducto */
    const prodBotonAgregar = document.getElementById(`agregar-${producto.id}`);
    if (producto.stock === 0) {
      prodBotonAgregar.disabled = true;
    }
    prodBotonAgregar.onclick = () => {
      agregarProducto(producto.id);
    };
  });
}

/* Cree esta clase para armar un item de un carrito
Además de tener el producto, tiene la cantidad ordenada y el subtotal
Corrijo el nombre de la clase, en mayuscula */
class ItemCarrito {
  constructor(producto, cantidad) {
    this.id = producto.id;
    this.nombre = producto.nombre;
    this.precio = producto.precio;
    this.cantidad = cantidad;
    this.subTotal = producto.precio * cantidad;
  }
}

/* Creo una clase que se llama carrito, cada uno de mis items es un ItemCarrito */
class Carrito {
  constructor() {
    this.items = [];
  }

  /* esta funcion agrega 1 unidad al carrito */
  agregar(idProducto) {
    /* asumo que es nuevo y recorro todo el array */
    let nuevo = true;
    this.items.forEach((item) => {
      /* si no es nuevo agrego 1 unidad */
      if (item.id === idProducto) {
        nuevo = false;
        item.cantidad++;
        item.subTotal = item.cantidad * item.precio;
      }
    });
    /*si es un producto nuevo agrega el item */
    if (nuevo) {
      const producto = productos.find((producto) => producto.id === idProducto);
      let miItem = new ItemCarrito(producto, 1);
      this.items.push(miItem);
    }
  }
  /* 
  antes este metodo se llamaba agregar, lo cambie a setearCantidad, es mas representativo de lo q hace
  */
  setearCantidad(idProducto, cantidad) {
    /* asumo que es nuevo y recorro todo el array */
    let nuevo = true;
    this.items.forEach((item) => {
      if (item.id === idProducto) {
        nuevo = false;
        item.cantidad = cantidad;
        item.subTotal = item.cantidad * item.precio;
      }
    });
    /*si es un producto nuevo agrega el item */
    if (nuevo) {
      const producto = productos.find((producto) => producto.id === idProducto);
      let miItem = new ItemCarrito(producto, cantidad);
      this.items.push(miItem);
    }
  }

  /* Calcula el precio total del carrito sumando los subtotales */
  total() {
    let total = 0;
    this.items.forEach((item) => {
      total += item.subTotal;
    });
    return total;
  }

  /* devuelvo el total de items que hay en el carrito */
  cantidadTotal() {
    let cuenta = 0;
    this.items.forEach((item) => {
      cuenta += item.cantidad;
    });
    return cuenta;
  }

  /* devuelvo la cantidad de un item que hay en el carrito */
  cantidadItem(idProducto) {
    const item = this.items.find((item) => item.id === idProducto);
    return item.cantidad;
  }

  /* devuelvo el subtotal de un item que hay en el carrito */
  subtotalItem(idProducto) {
    const item = this.items.find((item) => item.id === idProducto);
    return item.subTotal;
  }
  /* 
  cambie la funcionalidad de eliminar producto, toma como input el id
  */
  eliminar(idProducto) {
    this.items = this.items.filter((item) => item.id !== idProducto);
  }

  /* esto limpia el array */
  limpiar() {
    this.items = [];
  }

  /* instruccion para cargar lo que esta en local storage */
  cargar(itemsCarrito) {
    if (itemsCarrito != null && itemsCarrito.length > 0) {
      this.items = itemsCarrito;
    }
  }
}

/* cuando vendo el producto tengo que ajustar stock
resto la cantidad en la orden */
function ajustarStocks() {
  productos.forEach((producto) => {
    miCarrito.items.forEach((itemCarrito) => {
      if (producto.id === itemCarrito.id) {
        producto.stock -= itemCarrito.cantidad;
      }
    });
  });
}

const btnLimpiarCarrito = document.getElementById("btnLimpiarCarrito");
btnLimpiarCarrito.onclick = () => {
  limpiarCarrito();
};

const btnCheckout = document.getElementById("btnCheckout");
btnCheckout.onclick = () => {
  checkout();
};

function checkout() {
  /* todavia no arme esta pagina, pero la idea es que tome los datos del local storage para generar el checkout */
  window.location.href = "checkout.html";
}

/* limpiar el carrito no es sólo limpiar el array items dentro de carrito, tambien actualiza el modal  */
function limpiarCarrito() {
  /* limpio la variable carrito */
  miCarrito.limpiar();
  /* actualizo los items en el carrito */
  escribirItemsCarrito(miCarrito);
  /* actualizo la cantidad de items en carrito */
  actualizarContadorCarrito();
  /* limpio todo el html */
  productos.forEach((producto) => {
    /* vuelvo el boton agregar a su visualizacion original */
    document.getElementById(`agregar-${producto.id}`).disabled = false;
    if (producto.stock === 0) {
      document.getElementById(`agregar-${producto.id}`).disabled = true;
    }
    /* cambio para que solo aparezca el stock en la linea de stock (antes estaba la cantidad ordeanda tambien)*/
    document.getElementById(`stock-${producto.id}`).innerText = `Stock: ${producto.stock}`;
  });
  /* actualizo el local storage */
  actualizarLocalStorage();
}

function escribirItemsCarrito(carrito) {
  const itemsCarrito = document.getElementById("itemsCarrito");
  /* limpio el html */
  itemsCarrito.innerHTML = "";
  /* primero checkeo si el carrito esta vacio */
  if (carrito.cantidadTotal() > 0) {
    btnLimpiarCarrito.disabled = false;
    btnCheckout.disabled = false;

    carrito.items.forEach((item) => {
      /* voy a necesitar el producto para obtener la foto y el stock */
      const producto = productos.find((producto) => producto.id === item.id);
      const itemCarrito = document.createElement("li");
      itemCarrito.className = "list-group-item";
      /* uso el input numerico con un max que sea igual al stock */
      itemCarrito.innerHTML = `<div class="imagen"><img src="img/${producto.imagen}" alt="" /></div>
      <div class="texto">
        <div class="nombre">${producto.nombre}</div>
        <div class="stock">#SKU ${item.id} - stock ${producto.stock} unidades</div>
        <div class="precio-unit">Precio unitario $ ${producto.precio.toLocaleString()}</div>
      </div>
      <div class="cantidad"><input type="number" name="number" id="cantidad-${item.id}" min="1" max="${producto.stock}" step="1" value="${item.cantidad}" /></div>
      <div class="precio" id="subTotal-${item.id}">$ ${item.subTotal.toLocaleString()}</div>
      <div class="eliminar" id="eliminar-${item.id}"><i class="bi bi-trash"></i></div>`;
      itemsCarrito.appendChild(itemCarrito);
      const inputCantidad = document.getElementById(`cantidad-${item.id}`);
      const subTotal = document.getElementById(`subTotal-${item.id}`);
      inputCantidad.onchange = (e) => {
        /* agrego esta validacion para que no se ingresen cantidades menores que 1 o mayores que el stock  */
        let cantidad = parseInt(e.target.value);
        if (cantidad < 1) {
          cantidad = 1;
          mostrarModal("Error", "Cantidad minima: 1");
        }
        if (cantidad > producto.stock) {
          cantidad = producto.stock;
          mostrarModal("Error", `Cantidad máxima: ${producto.stock}`);
        }
        e.target.value = cantidad;

        /* el input por más que sea numero se transforma en string, así que lo tengo que convertir a numero
        para eso uso un parseint */
        carrito.setearCantidad(item.id, parseInt(cantidad));
        subTotal.innerText = `$ ${carrito.subtotalItem(item.id).toLocaleString()}`;
        /* si el stock es igual a lo que esta en carrito deshabilito el boton agregar de ese producto */
        cantidadCarrito = carrito.cantidadItem(item.id);
        /* cuando cambio la cantidad en el carrito, tmb cambia en la pagina inicial  */
        document.getElementById(`stock-${producto.id}`).innerText = `Stock: ${producto.stock} - ${cantidadCarrito} en carrito`;
        /* cuando igualo la cantidad ordenada a la cantidad en stock, boton de agregar de la pag ppal se deshabilita */
        if (cantidadCarrito === producto.stock) {
          document.getElementById(`agregar-${producto.id}`).disabled = true;
        } else {
          document.getElementById(`agregar-${producto.id}`).disabled = false;
        }
        /* actualizo la cantidad de items de carrito */
        actualizarContadorCarrito();
        /* actualizo el local storage */
        actualizarLocalStorage();
        /* actualizo el total */
        actualizarTotal();
      };
      const btnEliminarItem = document.getElementById(`eliminar-${item.id}`);
      btnEliminarItem.onclick = () => {
        eliminarProducto(item.id);
      };
    });
    /* ademas de esto tengo que agregar le subtotal */
    const calculoTotal = document.createElement("li");
    calculoTotal.className = "list-group-item";
    /* uso el input numerico con un max que sea igual al stock */
    calculoTotal.innerHTML = `
      <div class="texto">
        <div class="total">Total</div>
      </div>
      <div class="precio" id="total">$ ${miCarrito.total().toLocaleString()}</div>`;
    itemsCarrito.appendChild(calculoTotal);
  } else {
    btnLimpiarCarrito.disabled = true;
    btnCheckout.disabled = true;
    itemsCarrito.innerHTML = "Carrito vacio";
  }
}

function actualizarTotal() {
  if (miCarrito.cantidadTotal() > 0) {
    const total = document.getElementById("total");
    total.innerText = `$ ${miCarrito.total().toLocaleString()}`;
  }
}

function actualizarLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(miCarrito.items));
}

/* borre la funcion solicitad cantidad, la funcion agregarProducto ya no solicita cantidad, solo agrega 1 unidad */
function agregarProducto(idProducto) {
  /* busco de que prodcuto se trata */
  const producto = productos.find((producto) => producto.id === idProducto);
  /* ya no solicita la cantidad, directamente agrega 1 unidad */
  miCarrito.agregar(idProducto);
  /* actualizo los items en el carrito */
  escribirItemsCarrito(miCarrito);
  /* actualizo el contador */
  actualizarContadorCarrito();
  /* no cambia la vista borre esta linea */
  /* muestro modal anunciando que agregue un producto */
  mostrarModal("Producto agregado", `${producto.nombre} agregado a carrito`);
  /* obtengo la cantidad del carrito */
  const cantidadCarrito = miCarrito.cantidadItem(idProducto);
  /* donde aparece el stock pongo la cantidad ordenada */
  document.getElementById(`stock-${idProducto}`).innerText = `Stock: ${producto.stock} - ${cantidadCarrito} en carrito`;
  /* checkeo si la cantidad agregada es igual al stock si es asi deshaiblita boton */
  if (producto.stock === cantidadCarrito) {
    document.getElementById(`agregar-${idProducto}`).disabled = true;
  }
  /* actualizo el local storage */
  actualizarLocalStorage();
}

function eliminarProducto(idProducto) {
  /* quito el item del carrito */
  miCarrito.eliminar(idProducto);
  /* actualizo los items en el carrito */
  escribirItemsCarrito(miCarrito);
  /* actualizo los items en el carrito */
  actualizarContadorCarrito();
  /* busco el producto */
  const producto = productos.find((producto) => producto.id === idProducto);
  /* vuelvo el boton agregar a su visualizacion original */
  if (producto.stock > 0) {
    document.getElementById(`agregar-${idProducto}`).disabled = false;
  }
  /* cambio para que solo aparezca el stock en la linea de stock (antes estaba la cantidad ordeanda tambien)*/
  document.getElementById(`stock-${idProducto}`).innerText = `Stock: ${producto.stock}`;
  /* actualizo el local storage */
  actualizarLocalStorage();
}
/* borre la funcion de switchBotones */
/* cambie el nombre de esta funcion para que sea mas representativo lo q hace */
function actualizarContadorCarrito() {
  /* calculo la cantidad en el carrito */
  const itemsCarrito = miCarrito.cantidadTotal();
  /* cambio la cuenta de items en carrito */
  if (itemsCarrito > 0) {
    cuentaCarrito.innerHTML = `<i class="bi bi-cart-fill"></i> ${itemsCarrito} items en carrito`;
  } else {
    cuentaCarrito.innerHTML = `<i class="bi bi-cart"></i> Carrito vacio`;
  }
}

/* corro la funcion de actualizarHTML cuando carga el DOM */
document.addEventListener("DOMContentLoaded", inicializar());
let miCarrito = new Carrito();
const carritoEnLocalStorage = JSON.parse(localStorage.getItem("carrito"));
console.log(carritoEnLocalStorage);
miCarrito.cargar(carritoEnLocalStorage);
escribirItemsCarrito(miCarrito);
actualizarContadorCarrito();
actualizarVista();

/* esta funcion se corre al inicio dsps de haber cargado miCarrito */
function actualizarVista() {
  miCarrito.items.forEach((item) => {
    /* obtengo el producto del array productos para sacar el stock */
    const producto = productos.find((producto) => producto.id === item.id);
    document.getElementById(`stock-${item.id}`).innerText = `Stock: ${producto.stock} - ${item.cantidad} en carrito`;
    if (item.cantidad === producto.stock) {
      document.getElementById(`agregar-${item.id}`).disabled = true;
    }
  });
}

function inicializar() {
  /* cargo productos */
  cargarProductos();
}

/* INSTRUCCIONES PARA EL MODAL QUE MENSAJEA QUE SE AGREGO UN PRODUCTO */
/* creo el innerHTML del modal que se va a mostrar cada vez que agrego producto a carrito */
const divModal = document.getElementById("divModal");
divModal.innerHTML = `<div class="modal fade" tabindex="-1" id="modalAgregar">
<div class="modal-dialog modal-sm">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="tituloModal"></h5>
    </div>
    <div class="modal-body" id="textoModal"></div>
  </div>
</div>
</div>`;
/* tomo el id del modal para poder darle instrucciones para mostrar / ocultar */
const modalAgregar = document.getElementById("modalAgregar");
const tituloModal = document.getElementById("tituloModal");
const textoModal = document.getElementById("textoModal");
/* busque como hacer para ocultar el modal dsps de cierto tiempo, el timeout son milisegundos */
/* el toggle lo saque de bootstrap directamente */
const bsModalAgregar = new bootstrap.Modal(modalAgregar, {});
modalAgregar.addEventListener("show.bs.modal", () => {
  setTimeout(function () {
    bsModalAgregar.toggle();
  }, 1000);
});
/* puedo configurar el modal para que tome el nombre del producto que agrego */
function mostrarModal(titulo, texto) {
  tituloModal.innerText = titulo;
  textoModal.innerText = texto;
  bsModalAgregar.toggle();
}
