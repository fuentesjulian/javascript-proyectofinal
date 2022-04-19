/* 
para simplificar el código puse sólo un array de productos sin la master data
*/
let productos = [];
productos[0] = { id: "PR5", nombre: "Procesador Ryzen 5", precio: 35000, stock: 3, descripcion: "Procesador Ryzen 5 3900x", imagen: "ryzen5.png" };
productos[1] = { id: "PR7", nombre: "Procesador Ryzen 7", precio: 65000, stock: 2, descripcion: "Procesador Ryzen 7 5800x", imagen: "ryzen7.png" };
productos[2] = { id: "PI5", nombre: "Procesador Intel I5", precio: 37000, stock: 4, descripcion: "Procesador Intel i5 10ma generacion", imagen: "i5.png" };
productos[3] = { id: "PI7", nombre: "Procesador Intel I7", precio: 37000, stock: 4, descripcion: "Procesador Intel i7 10ma generacion", imagen: "i7.png" };
productos[4] = { id: "MOA", nombre: "Motherboard Asus", precio: 45000, stock: 2, descripcion: "Motherboard Asus Gamer Z590-e", imagen: "asus.png" };
productos[5] = { id: "MOG", nombre: "Motherboard Gigabyte", precio: 25000, stock: 2, descripcion: "Mothherboard Gigabyte Z690", imagen: "gigabyte.png" };

/* es un numero de factura que va subiendo a medida que voy facturando */
let numeroFact = 0;

/* seta función sirve para cargar los productos al HTML */
function cargarProductos() {
  /* 
  limpio el HTML (en la primer carga no es necesario, pero si voy facturando necesito actualizar todo) 
  seguramente haya una oportunidad de optimizar esto, no hacer un reload cada vez que facturo 
  y cambiar solo las cantidades
  actualización: le cambie el codigo para hacerlo todo por JS (antes lo hice con innerHTML)
  fue medio complicado porque hay divs anidados
  */
  articulos.innerHTML = "";
  productos.forEach((producto) => {
    /* agrego cada producto al articulo dentro del body en el html */
    const plantilla = document.createElement("div");
    plantilla.className = "card";
    /* titulo */
    const prodTitulo = document.createElement("h5");
    prodTitulo.className = "titulo";
    prodTitulo.textContent = producto.nombre;
    /* imagen */
    const prodImagen = document.createElement("div");
    prodImagen.className = "imagen";
    const imgElement = document.createElement("img");
    imgElement.className = "card-img-top";
    imgElement.src = `img/${producto.imagen}`;
    prodImagen.appendChild(imgElement);
    /* body de la tarjeta: va a tener el precio, descrpcion, id, stock y boton de compra*/
    const prodBody = document.createElement("div");
    prodBody.className = "card-body";
    /* precio */
    const prodPrecio = document.createElement("p");
    prodPrecio.className = "precio";
    /* le doy formato como numero local (separador de miles) */
    prodPrecio.textContent = `ARS ${producto.precio.toLocaleString()}`;
    /* descripcion */
    const prodDescripcion = document.createElement("p");
    prodDescripcion.className = "card-text descripcion";
    prodDescripcion.textContent = producto.descripcion;
    /* ID Del item */
    const prodItemId = document.createElement("p");
    prodItemId.className = "card-text";
    prodItemId.textContent = `ID: ${producto.id}`;
    /* stock */
    const prodStock = document.createElement("p");
    prodStock.className = "card-text";
    prodStock.id = `stock-${producto.id}`;
    prodStock.textContent = `Stock: ${producto.stock}`;
    /* boton de compra */
    const prodBotonAgregar = document.createElement("button");
    prodBotonAgregar.className = "btn btn-success";
    prodBotonAgregar.id = `agregar-${producto.id}`;
    prodBotonAgregar.textContent = "Agregar";
    prodBotonAgregar.onclick = () => {
      agregarProducto(producto.id);
    };

    /* creo este boton para eliminar del carrito oculto */
    const prodBotonEliminar = document.createElement("button");
    prodBotonEliminar.className = "btn btn-danger";
    prodBotonEliminar.id = `eliminar-${producto.id}`;
    prodBotonEliminar.textContent = "Eliminar";
    prodBotonEliminar.onclick = () => {
      eliminarProducto(producto.id);
    };
    prodBotonEliminar.style.display = "none";

    /* agrego el precio, descripcion, id, stock y boton al body */
    prodBody.appendChild(prodPrecio);
    prodBody.appendChild(prodDescripcion);
    prodBody.appendChild(prodItemId);
    prodBody.appendChild(prodStock);
    prodBody.appendChild(prodBotonAgregar);
    prodBody.appendChild(prodBotonEliminar);
    /* la plantilla tiene titulo, imagen y body */
    plantilla.appendChild(prodTitulo);
    plantilla.appendChild(prodImagen);
    plantilla.appendChild(prodBody);
    /* agrego la plantilla al html */
    articulos.appendChild(plantilla);
  });
}

/* 
Cree esta clase para armar un item de un carrito
Además de tener el producto, tiene la cantidad ordenada y el subtotal
*/
class itemCarrito {
  constructor(producto, cantidad) {
    this.id = producto.id;
    this.nombre = producto.nombre;
    this.precio = producto.precio;
    this.cantidad = cantidad;
    this.subTotal = producto.precio * cantidad;
  }
}

/* Creo una clase que se llama carrito, cada uno de mis items es un itemCarrito */
class Carrito {
  constructor() {
    this.items = [];
  }

  /* 
  cambie la funcionalidad de agregar producto, basicamente ahora lo hace por id de producto
  */
  agregar(idProducto, cantidad) {
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
      let miItem = new itemCarrito(producto, cantidad);
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

  /* sumo el total de items que hay en el carrito */
  cantidad() {
    let cuenta = 0;
    this.items.forEach((item) => {
      cuenta += item.cantidad;
    });
    return cuenta;
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
}

function emitirFactura() {
  /* borre el condicional de si cantidad de items mayor qu ecero */
  /* escribirItemsCarrito es una funcion que me convierte la info del carrito a string */
  let itemsCarrito = escribirItemsCarrito(miCarrito);
  /* cargo el total, calculo iva y sumo */
  const totalSinIVA = miCarrito.total();
  const IVA = totalSinIVA * 0.21;
  const totalConIVA = totalSinIVA + IVA;
  /* aumento el numero de la factura */
  numeroFact++;
  /* concateno todo en un solo string */
  alert(`Factura ${numeroFact} \n${itemsCarrito} \nTotal sin IVA: ${totalSinIVA} \nIVA: ${IVA} \nTotal con IVA ${totalConIVA}`);
  /* ajusto el stock para que lo facturado no aparezca */
  ajustarStocks();
  /* limpio el carrito */
  limpiarCarrito();
  /* deshabilito botones */
  switchBotones();
  /* borre el else; el boton de facturar queda deshabilitado si no hay items */
}

function mostrarCarrito() {
  /* borre el condicional de si cantidad de items mayor qu ecero */
  /* escribirItemsCarrito es una funcion que me convierte la info del carrito a string */
  let itemsCarrito = escribirItemsCarrito(miCarrito);
  /* cargo el total, calculo iva y sumo */
  const totalSinIVA = miCarrito.total();
  const IVA = totalSinIVA * 0.21;
  const totalConIVA = totalSinIVA + IVA;
  /* concateno todo en un solo string */
  alert(`Carrito: \n${itemsCarrito} \nTotal sin IVA: ${totalSinIVA} \nIVA: ${IVA} \nTotal con IVA ${totalConIVA}`);
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

/* limpiar el carrito no es sólo limpiar el array items dentro de carrito,
 */
function limpiarCarrito() {
  /* limpio la variable carrito */
  miCarrito.limpiar();
  /* actualizo la cantidad de items en carrito */
  actualizarItemsCarrito();
  /* limpio todo el html */
  productos.forEach((producto) => {
    /* vuelvo el boton agregar a su visualizacion original */
    document.getElementById(`agregar-${producto.id}`).innerText = "Agregar";
    document.getElementById(`agregar-${producto.id}`).className = "btn btn-success";
    if(producto.stock===0){
      document.getElementById(`agregar-${producto.id}`).disabled = true;
    }
    /* cambio para que solo aparezca el stock en la linea de stock (antes estaba la cantidad ordeanda tambien)*/
    document.getElementById(`stock-${producto.id}`).innerText = `Stock: ${producto.stock}`;
    /* oculto el boton para eliminar del carrito */
    document.getElementById(`eliminar-${producto.id}`).style.display = "none";
  });
}

function escribirItemsCarrito(carrito) {
  /* primero checkeo si el carrito esta vacio */
  if (carrito.cantidad() > 0) {
    /* si no esta vacio corro una funcion que desglose el array y lo pase a un string */
    return desglosar(carrito.items, carrito.cantidad() + ` Items en Carrito:`);
  } else {
    return "Carrito vacio\n\n";
  }
}

/* esto lo uso el profe para desglosar cada variable, lo mostró en clase y me encantó
lo que le agregue de complejidad es que recorro el array item por item y le pongo un titulo al ppio de la string  */
function desglosar(variable, titulo) {
  let auxString = titulo;
  variable.forEach((item) => {
    auxString += `\n`;
    /* esto es la versión 3.0 de lo que mostró el profe */
    for (propiedad in item) {
      auxString += `${propiedad}: ${item[propiedad]} - `;
    }
  });
  return auxString;
}

/* 
cuando pido la cantidad checkeo
  si aprieta cancelar
  si escribe un numero
  si el nro es mayor que cero
  si el nro supera la cantidad
  o si quiere salir (con s)
esto me gustaria dsps hacerlo yendo a otra pagina como me adelantaste
*/
function solicitarCantidad(producto) {
  let seguirLoop = true;
  let ingreso = prompt(`Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.stock}\n(Ingrear 's' o el boton cancelar para Salir)`);
  let cantidad = parseInt(ingreso);
  while (seguirLoop) {
    /* si aprieta el boton cancelar hago un return -1 para salir del prompt */
    if (!ingreso) return -1;
    /* si ingresa algo empiezo a hacer los checkeos */
    if (ingreso.toLocaleLowerCase() === "s") {
      return -1;
    } else {
      if (!cantidad) {
        ingreso = prompt(`Debes ingresar un numero mayor que cero. Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.stock}\n(s para Salir)`);
        cantidad = parseInt(ingreso);
      } else if (cantidad < 0) {
        ingreso = prompt(`Debes ingresar un numero mayor que cero. Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.stock}\n(s para Salir)`);
        cantidad = parseInt(ingreso);
      } else if (cantidad > producto.stock) {
        ingreso = prompt(`La cantidad ordenada supera el stock. Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.stock}\n(s para Salir)`);
        cantidad = parseInt(ingreso);
      } else {
        seguirLoop = false;
      }
    }
  }
  return cantidad;
}

function agregarProducto(idProducto) {
  /* busco de que prodcuto se trata */
  const producto = productos.find((producto) => producto.id === idProducto);
  /* solicito la cantidad */
  const cantidad = solicitarCantidad(producto);
  /* si elijo salir devuelvo -1 , asi que nomás ejecuto esta parte si devuelvo un nro mayor que cero */
  if (cantidad > 0) {
    /* cambio la cantidad en el carrito */
    miCarrito.agregar(idProducto, cantidad);
    /* actualizo los items en el carrito */
    actualizarItemsCarrito();
    /* cambio la visual del boton de agregar --> cambiar cantidad */
    document.getElementById(`agregar-${idProducto}`).innerText = "Modificar";
    document.getElementById(`agregar-${idProducto}`).className = "btn btn-primary";
    /* donde aparece el stock pongo la cantidad ordenada */
    document.getElementById(`stock-${idProducto}`).innerText = `Stock: ${producto.stock} - ${cantidad} en carrito`;
    /* muestro el boton para eliminar del carrito */
    document.getElementById(`eliminar-${idProducto}`).style.display = "inline-block";
    /* corro la instruccion para habilitar / deshabilitar el boton de borrar carrito */
    switchBotones();
  }
}

function eliminarProducto(idProducto) {
  /* quito el item del carrito */
  miCarrito.eliminar(idProducto);
  /* actualizo los items en el carrito */
  actualizarItemsCarrito();
  /* vuelvo el boton agregar a su visualizacion original */
  document.getElementById(`agregar-${idProducto}`).innerText = "Agregar";
  document.getElementById(`agregar-${idProducto}`).className = "btn btn-success";
  /* donde aparece el stock pongo la cantidad ordenada */
  /* busco el producto */
  const producto = productos.find((producto) => producto.id === idProducto);
  /* cambio para que solo aparezca el stock en la linea de stock (antes estaba la cantidad ordeanda tambien)*/
  document.getElementById(`stock-${idProducto}`).innerText = `Stock: ${producto.stock}`;
  /* oculto el boton para eliminar del carrito */
  document.getElementById(`eliminar-${idProducto}`).style.display = "none";
  /* corro la instruccion para habilitar / deshabilitar el boton de borrar carrito */
  switchBotones();
}

function switchBotones() {
  if (miCarrito.cantidad() > 0) {
    btnLimpiarCarrito.disabled = false;
    btnVerCarrito.disabled = false;
    btnFacturar.disabled = false;
  } else {
    btnLimpiarCarrito.disabled = true;
    btnVerCarrito.disabled = true;
    btnFacturar.disabled = true;
  }
}

function actualizarItemsCarrito() {
  /* calculo la cantidad en el carrito */
  const itemsCarrito = miCarrito.cantidad();
  /* cambio la cuenta de items en carrito */
  if (itemsCarrito > 0) {
    cuentaCarrito.textContent = `${itemsCarrito} items en carrito`;
  } else {
    cuentaCarrito.textContent = "Carrito vacio";
  }
}

/* corro la funcion de actualizarHTML cuando carga el DOM */
document.addEventListener("DOMContentLoaded", inicializar());
let miCarrito = new Carrito();
const btnLimpiarCarrito = document.getElementById("btnLimpiarCarrito");
const btnVerCarrito = document.getElementById("btnVerCarrito");
const btnFacturar = document.getElementById("btnFacturar");

btnLimpiarCarrito.onclick = () => {
  /* limpio carrito */
  limpiarCarrito();
  /* deshabilito botones */
  switchBotones();
};

btnVerCarrito.onclick = () => {
  mostrarCarrito();
};

btnFacturar.onclick = () => {
  emitirFactura();
};

function inicializar() {
  /* cargo productos */
  cargarProductos();
}
