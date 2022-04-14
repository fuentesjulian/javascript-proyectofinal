/* 
Supongo que la master data que recibo de una base de datos tiene más info que la que voy a usar para el mapeo de productos
Dicha info puede ser:
Texto descriptivo
Link de la o las imagenes
Campos como generación del procesador, velocidad, etc que quizás no hacen a la estructura del carrito
*/
let masterData = [];

masterData[0] = { id: "PR5", nombre: "Procesador Ryzen 5", precio: 35000, stock: 3, descripcion: "Procesador Ryzen 5 3900x", imagen: "ryzen5.png" };
masterData[1] = { id: "PR7", nombre: "Procesador Ryzen 7", precio: 65000, stock: 2, descripcion: "Procesador Ryzen 7 5800x", imagen: "ryzen7.png" };
masterData[2] = { id: "PI5", nombre: "Procesador Intel I5", precio: 37000, stock: 4, descripcion: "Procesador Intel i5 10ma generacion", imagen: "i5.png" };
masterData[3] = { id: "PI7", nombre: "Procesador Intel I7", precio: 37000, stock: 4, descripcion: "Procesador Intel i7 10ma generacion", imagen: "i7.png" };
masterData[4] = { id: "MOA", nombre: "Motherboard Asus", precio: 45000, stock: 2, descripcion: "Motherboard Asus Gamer Z590-e", imagen: "asus.png" };
masterData[5] = { id: "MOG", nombre: "Motherboard Gigabyte", precio: 25000, stock: 2, descripcion: "Mothherboard Gigabyte Z690", imagen: "gigabyte.png" };

/*
Creo una clase que se llama producto.
En la misma pongo el ID del producto (con el cual hago el input para armar la orden)
El nombre del producto (breve descripción de lo que estoy vendiendo)
El precio unitario
El stock total del producto
Además creo una variable que es el stock Post Orden
Si tengo un stock total de 3, pero mi pedido ya tiene cargado 2, mi stock post orden es 1
*/

class producto {
  constructor(id, nombre, precio, stock) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.postOrden = stock;
  }
}

/* es un numero de factura que va subiendo a medida que voy facturando */
let numeroFact = 0;

/* 
Declaro los productos
*/
let productos = [];

const articulos = document.getElementById("articulos");
/* Creo mi array de productos y pueblo el documento */
masterData.forEach((item) => {
  /* agrego un producto a mi array de productos */
  productos.push(new producto(item.id, item.nombre, item.precio, item.stock));
});

function actualizarHTML() {
  /* 
  limpio el HTML (en la primer carga no es necesario, pero si voy facturando necesito actualizar todo) 
  seguramente haya una oportunidad de optimizar esto, no hacer un reload cada vez que facturo 
  y cambiar solo las cantidades!
  */
  articulos.innerHTML = "";
  masterData.forEach((item) => {
    /* agrego cada producto al articulo dentro del body en el html */
    const plantilla = document.createElement("div");
    plantilla.className = "card";
    plantilla.innerHTML = `
      <h5 class="titulo">${item.nombre}</h5>
      <div class="imagen"><img src="img/${item.imagen}" class="card-img-top" alt="..."></div>
      <div class="card-body">
        <p class="precio">ARS ${item.precio}</p>
        <p class="card-text">${item.descripcion}</p>
        <p class="card-text">ID: ${item.id}</p>
        <p class="card-text">Stock: ${item.stock} unidades</p>
        <a href="#" class="btn btn-primary" onClick="comprar('${item.id}');">Comprar</a>
      </div>
    `;
    articulos.appendChild(plantilla);
  });
}

/* Esta funcion actualiza la MD */
function actualizarMasterData() {
  productos.forEach((itemProductos) => {
    masterData.forEach((itemMasterData) => {
      if (itemProductos.id === itemMasterData.id) itemMasterData.stock = itemProductos.stock;
    });
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
class carrito {
  constructor() {
    this.items = [];
  }

  /* Primero checkeo si el item que quiero agregar ya estaba en la lista
Ejemplo: compro 1 procesador Ryzen 5, luego agrego otro, en vez de agregar otro item, cambio la cantidad
*/
  agregar(producto, cantidad) {
    /* asumo que es nuevo y recorro todo el array */
    let nuevo = true;
    this.items.forEach((item) => {
      if (item.id === producto.id) {
        nuevo = false;
        item.cantidad += cantidad;
        item.subTotal = item.cantidad * item.precio;
      }
    });
    /*si es un producto nuevo agrega el item */
    if (nuevo) {
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

  /* Este quitar tiene una funcionalidad parecida al agregar
  si quiero quitar una cantidad igual a la que tengo en el carrito, quita el item directamente 
  no lo estoy usando, pero lo probe con dos instrucciones:
  agrego
  miCarrito.agregar(productos[0],2)
  quito
  miCarrito.quitar(productos[1], 1)
  */
  quitar(producto, cantidad) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === producto.id) {
        if (this.items[i].cantidad > cantidad) {
          this.items[i].cantidad -= cantidad;
          this.items[i].subTotal = this.items[i].cantidad * this.items[i].precio;
        } else {
          this.eliminar(producto);
        }
      }
    }
  }

  /* 
  Instruccion para eliminar producto del carrito 
  es casi igual a la que me habias sugerido en el chat, tuve que cambiarle algo pequeño
  */
  eliminar(producto) {
    this.items = this.items.filter((item) => item.id !== producto.id);
  }

  /* esto limpia el array */
  limpiar() {
    this.items = [];
  }
}

/* creo un carrito */
let miCarrito = new carrito();

/* cargo la tiendaOnline
me pareció ordenado intentar desglosar el programa en instrucciones más cortas
lo primero que carga es un menú principal
el menú devuelve opciones para agregar producto, facturar, salir, o limpiar el carrito
*/
function tiendaOnline() {
  let continuar = true;
  do {
    let auxString = escribirItemsCarrito(miCarrito);
    const opcion = prompt(
      auxString + "\n\nCuentanos que quieres hacer \nA - agregar producto a carrito \nE - eliminar producto de carrito \nL - limpiar carrito \nF - emitir factura \nS - salir"
    ).toUpperCase();
    switch (opcion) {
      case "A":
        agregarProducto(miCarrito);
        break;
      case "E":
        eliminarProducto(miCarrito);
        break;
      case "L":
        limpiarCarrito();
        break;
      case "F":
        emitirFactura(miCarrito);
        break;
      case "S":
        continuar = false;
        break;
      default:
        alert("Opcion no valida");
    }
  } while (continuar);
}

function eliminarProducto(carrito) {
  if (carrito.cantidad() > 0) {
    let continuar = true;

    do {
      /* el loop sigue hasta que ponga un producto valido o escriba S para salir 
       paso a string el carrito */
      let carritoString = escribirItemsCarrito(miCarrito);
      /* creo el string del prompt */
      let auxString = `Escriba el ID del producto que quiere eliminar (S para salir):\n${carritoString}`;
      let id = prompt(auxString).toUpperCase();
      /* si escribe S salgo, uso el return -1 para que con el if (producto >= 0) de agregarProducto pueda filtrarlo y no pida cantidad */
      if (id === "S") {
        continuar = false;
      } else {
        /* checkeo que el ID sea valido y exista en el carrito */
        /* checkeo que el ID sea valido */
        /* creo producto para filtrar, lo uso 3 veces en el codigo */
        const producto = productos.filter((producto) => producto.id === id);

        if (producto.length > 0) {
          /* checkeo que el producto exista en el carrito */
          if (carrito.items.filter((item) => item.id === id).length > 0) {
            /* elimino el producto */
            carrito.eliminar(producto[0]);
            /* reseteo stock post orden de producto */
            resetCantidadProducto(producto[0]);
            alert(`Producto ID ${id} eliminado exitosamente del carrito`);
            /* salgo del loop */
            continuar = false;
          } else {
            alert(`El producto ID ${id} no se encuentra en el carrito`);
          }
        } else {
          alert("ID de producto invalido");
        }
      }
    } while (continuar);
  } else {
    /*no tengo items para eliminar  */
    alert("El carrito esta vacio! Nada que eliminar");
  }
}

function emitirFactura(carrito) {
  /*si tengo por lo menos un item para facturar puedo emitir factura */
  if (carrito.cantidad() > 0) {
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
    miCarrito.limpiar();
    /* actualizo MD */
    actualizarMasterData();
    /* cargo nuevamente el HTML */
    actualizarHTML();
  } else {
    /*no tengo items para facturar  */
    alert("El carrito esta vacio! Nada que facturar");
  }
}

/* cuando vendo el producto tengo que ajustar stock
esto se hace basicamente haciedno que el stockPost orden sea el nuevo stock */
function ajustarStocks() {
  productos.forEach((producto) => {
    producto.stock = producto.postOrden;
  });
}

/* limpiar el carrito no es sólo limpiar el array items dentro de carrito, tmb tengo que resetar las cantidades de los stocks
esto es al reves que cuando facturo, quiero que el stock post orden ahora tome el valor de stock inical */
function limpiarCarrito() {
  miCarrito.limpiar();
  resetCantidadesProducto();
  alert("Carrito limpio");
}
/* si no facturo y limpio el carrito, el stock queda intacto, el stock post orden vuelve a tomar los valores de stock  */
function resetCantidadesProducto() {
  productos.forEach((producto) => {
    producto.postOrden = producto.stock;
  });
}

function resetCantidadProducto(producto) {
  productos.forEach((item) => {
    if (item.id === producto.id) {
      producto.postOrden = producto.stock;
    }
  });
}

/* agregarproducto consiste en primero solicitar el numero de producto y luego solicitar la cantidad */
function agregarProducto(carrito) {
  /* obtengo la posicion del producto dentro de la variable productos 
    si es -1 no hace nada */
  const producto = solicitarProducto();
  if (producto >= 0) {
    /* solcito la cantidad */
    let cantidad = solicitarCantidad(productos[producto]);
    /* agrego al carrito la cantidad */
    carrito.agregar(productos[producto], cantidad);
    /* resto al stock post orden la cantidad agregada */
    productos[producto].postOrden -= cantidad;
  }
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

function solicitarProducto() {
  do {
    /* el loop sigue hasta que ponga un producto valido o escriba S para salir 
     paso a string el carrito */
    let carritoString = escribirItemsCarrito(miCarrito);
    /* paso a string los productos de la tienda */
    let productosString = desglosar(productos, "Productos \n(precios sin IVA - postOrden es el stock post orden)");
    /* creo el string del prompt */
    let auxString = `Escriba el ID del producto que quiere agregar (S para salir):\nID validos: PR5, PR7, PI5, PI7, MOA, MOG\n${carritoString}\n\n${productosString}`;
    let id = prompt(auxString).toUpperCase();
    /* si escribe S salgo, uso el return -1 para que con el if (producto >= 0) de agregarProducto pueda filtrarlo y no pida cantidad */
    if (id === "S") {
      return -1;
    } else {
      for (let i = 0; i < productos.length; i++) {
        /* checkeo que el ID coincida, tmb checkeo que haya stock 
        si coincide y hay stock devuelvo la posicion del item */
        if (productos[i].id === id) {
          if (productos[i].postOrden > 0) {
            return i;
          } else {
            /* si no hay stock le aclaro */
            alert("No puedes agregar ese producto, no hay stock");
          }
        }
      }
    }
  } while (true);
}

/* cuando pido la cantidad checkeo
que la cantidad sea un nro mayor que cero
que la cantidad no supere al stock que hay post orden 
*/
function solicitarCantidad(producto) {
  let continuar = false;
  let cantidad = parseInt(prompt(`Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.postOrden}`));
  while (!continuar) {
    if (!cantidad) {
      cantidad = parseInt(prompt(`Debes ingresar un numero mayor que cero. Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.postOrden}`));
    } else if (cantidad < 0) {
      cantidad = parseInt(prompt(`Debes ingresar un numero mayor que cero. Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.postOrden}`));
    } else if (cantidad > producto.postOrden) {
      cantidad = parseInt(prompt(`La cantidad ordenada supera el stock. Escriba la cantidad que quiere ordenar: \n${producto.id} ${producto.nombre} - Stock ${producto.postOrden}`));
    } else {
      continuar = true;
    }
  }
  return cantidad;
}

function comprar(id){
  alert(`Placeholder para agregar funciones cuando clickeo el boton comprar. Clickeaste el id: ${id}`)
}

actualizarHTML();
