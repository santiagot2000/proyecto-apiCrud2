let d = document;
let clienteSelect = d.querySelector('#cliente-select');
let metodoPago = d.querySelector('#metodo-pago');
let descuento = d.querySelector('#descuento');
let aumento = d.querySelector('#aumento');
let productoSelect = d.querySelector('#producto-select');
let cantidad = d.querySelector('#cantidad');
let btnAgregarProducto = d.querySelector('#btn-agregar-producto');
let productosPedido = d.querySelector('#productos-pedido');
let totalPedido = d.querySelector('#total-pedido');
let btnCreate = d.querySelector('.btn-create');
let btnUpdate = d.querySelector('.btn-update');
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");
let pedidoUpdate;

// Variables globales faltantes
let productos = [];
let total = 0;

// Función para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    nameUser.textContent = user.nombre;
};

// Evento para el botón del logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "./login.html";
});

// Evento al botón del formulario
btnCreate.addEventListener('click', () => {
    let data = getDataPedido();
    if (data) sendDataPedido(data);
});

// Evento al navegador para comprobar si recargó la página
d.addEventListener("DOMContentLoaded", () => {
    getUser();
    cargarClientes();
    cargarProductos
    const url = new URLSearchParams(window.location.search);
    const id = url.get("id");
    if (id) {
        pedidoUpdate = JSON.parse(localStorage.getItem("pedidoEdit"));
        if (pedidoUpdate && pedidoUpdate.id == id) {
            updateDataPedido();
        }
    }
});

function cargarClientes() {
    fetch("http://localhost/proyecto-apiCrud/backend-apiCrud/clientes")
        .then(response => response.json())
        .then(data => {
            const clienteSelect = document.getElementById("cliente-select");
            data.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id_cliente; // ✅ CORREGIDO
                option.textContent = `${cliente.nombre} ${cliente.apellido}`;
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error cargando clientes:", error);
            alert("Error al cargar los clientes. Intenta nuevamente.");
        });
}

function cargarProductos() {
    fetch("http://localhost/proyecto-apiCrud/backend-apiCrud/productos")
        .then(response => response.json())
        .then(data => {
            const productoSelect = document.getElementById("producto-select");
            //productoSelect.innerHTML = '<option value="">Seleccionar Producto</option>';
            data.forEach(producto => {
                const option = document.createElement("option");
                option.value = producto.id;
                option.textContent = `${producto.nombre} - $${parseFloat(producto.precio).toLocaleString()}`;
                option.dataset.precio = producto.precio;
                productoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error cargando productos:", error);
            alert("Error al cargar los productos. Intenta nuevamente.");
        });
}

// Función para validar el formulario y obtener los datos
let getDataPedido = () => {
    let pedido;
    if (clienteSelect.value && metodoPago.value && productos.length > 0 && total > 0 && descuento.value !== "" && aumento.value !== "") {
        pedido = {
            id_cliente: clienteSelect.value,
            metodo_pago: metodoPago.value,
            descuento: parseFloat(descuento.value) || 0,
            aumento: parseFloat(aumento.value) || 0,
            productos: productos.map(p => ({
                id_producto: p.id,
                precio: p.precio,
                cantidad: p.cantidad
            }))
        };
        console.log("Enviando pedido:", pedido);
    } else {
        alert("Todos los campos obligatorios deben estar completos.");
    }
    return pedido;
};

// Función para enviar datos al servidor
let sendDataPedido = async (data) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/pedidos";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        let mensaje = await respuesta.json();
        if (!clienteSelect.value) {
            alert("Por favor, selecciona un cliente.");
            return null;
        }
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            alert(mensaje.message);
            location.href = "listado-pedidos.html";
        }
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            alert(errorData.message || "Error inesperado.");
            return;
        }
    } catch (error) {
        console.error(error);
        alert("Error al crear el pedido. Intenta nuevamente.");
    }
};

// Función para editar el pedido
let updateDataPedido = () => {
    clienteSelect.value = pedidoUpdate.cliente_id;
    metodoPago.value = pedidoUpdate.metodo_pago;
    descuento.value = pedidoUpdate.descuento;
    aumento.value = pedidoUpdate.aumento;

    btnCreate.classList.add("d-none");
    btnUpdate.classList.remove("d-none");

    // Evento único para actualizar
    btnUpdate.addEventListener('click', () => {
        const pedido = {
            id: pedidoUpdate.id,
            cliente_id: clienteSelect.value,
            metodo_pago: metodoPago.value,
            fecha: new Date().toISOString().split('T')[0],
            total: total,
            estado: "Pendiente",
            productos: productos
        };
        localStorage.removeItem("pedidoEdit");
        sendUpdatePedido(pedido);
    }, { once: true });
};

// Función para enviar actualización al servidor
let sendUpdatePedido = async (pedido) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/pedidos";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-pedidos.html";
        }
    } catch (error) {
        console.error(error);
        alert("Error al actualizar el pedido. Intenta nuevamente.");
    }
};

// Agregar producto
btnAgregarProducto.addEventListener('click', () => {
    let productoId = productoSelect.value;
    let productoNombre = productoSelect.options[productoSelect.selectedIndex].text;
    let productoPrecio = productoSelect.options[productoSelect.selectedIndex].dataset.precio;
    let productoCantidad = parseInt(cantidad.value);

    if (
        !productoId ||
        !productoCantidad ||
        productoCantidad <= 0 ||
        !Number.isInteger(productoCantidad)
    ) {
        alert("Selecciona un producto válido y una cantidad mayor a 0.");
        return;
    }

    let producto = {
        id: productoId,
        nombre: productoNombre,
        precio: parseFloat(productoPrecio),
        cantidad: productoCantidad,
        subtotal: parseFloat(productoPrecio) * productoCantidad
    };

    productos.push(producto);
    total += producto.subtotal;

    renderProductosPedido();
    cantidad.value = '';
});

function eliminarProducto(index) {
    total -= productos[index].subtotal;
    productos.splice(index, 1);
    renderProductosPedido();
}

let renderProductosPedido = () => {
    productosPedido.innerHTML = '';
    productos.forEach((producto, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toLocaleString()}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.subtotal.toLocaleString()}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        productosPedido.appendChild(fila);
    });

    let totalConAjustes = total + (total * (parseFloat(aumento.value) || 0) / 100) - (total * (parseFloat(descuento.value) || 0) / 100);
    totalPedido.textContent = "$" + totalConAjustes.toLocaleString();
};