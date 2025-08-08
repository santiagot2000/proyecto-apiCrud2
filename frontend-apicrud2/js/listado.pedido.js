// variables globales
const tablePedidos = document.querySelector("#table-pedidos tbody");
const searchInput = document.querySelector("#search-input");
const nameUser = document.querySelector("#nombre-usuario");
const btnLogout = document.querySelector("#btnLogout");

// función para poner nombre de usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    if (user) {
        nameUser.textContent = user.usuario;
    } else {
        location.href = "./login.html";
    }
};

// evento para el botón del logout
btnLogout.addEventListener("click", () => {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
        localStorage.removeItem("userLogin");
        location.href = "./login.html";
    }
});

// evento para el campo de búsqueda
searchInput.addEventListener("keyup", () => {
    searchPedidosTable();
});

// evento al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    getTableDataPedidos();
    getUser();
});

// función para traer los datos de la BD a la tabla
let getTableDataPedidos = async () => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/pedidos";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (respuesta.status === 204) {
            console.log("No hay pedidos en la BD");
        } else {
            let data = await respuesta.json();
            localStorage.setItem("pedidosTabla", JSON.stringify(data));
            renderPedidosTable(data);
        }
    } catch (error) {
        console.log(error);
    }
};

// función para renderizar la tabla
let renderPedidosTable = (data) => {
    tablePedidos.innerHTML = "";
    data.forEach((pedido, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${pedido.nombre || "Sin nombre"}</td>
            <td><span class="badge badge-${getBadgeColor(pedido.metodo_pago)}">${pedido.metodo_pago || "N/A"}</span></td>
            <td>$${(pedido.descuento || 0).toLocaleString()}</td>
            <td>$${(pedido.aumento || 0).toLocaleString()}</td>
            <td>${new Date(pedido.fecha).toLocaleString()}</td>
            <td><span class="badge badge-${getEstadoColor(pedido.estado)}">${pedido.estado || "Sin estado"}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editPedido(${i})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePedido(${i})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="verPedido(${i})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tablePedidos.appendChild(row);
    });
};

// editar pedido
let editPedido = (index) => {
    let pedidos = JSON.parse(localStorage.getItem("pedidosTabla")) || [];
    let pedido = pedidos[index];
    localStorage.setItem("pedidoEdit", JSON.stringify(pedido));
    location.href = "crear-pedido.html";
};

// eliminar pedido
let deletePedido = async (index) => {
    let pedidos = JSON.parse(localStorage.getItem("pedidosTabla")) || [];
    let pedido = pedidos[index];

    if (!pedido || !pedido.id) {
        alert("No se puede eliminar: faltan datos.");
        return;
    }

    let confirmar = confirm(`¿Deseas eliminar el pedido de ${pedido.nombre}?`);
    if (!confirmar) return;

    try {
        let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/pedidos";
        let respuesta = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: pedido.id })
        });

        if (respuesta.status === 406) {
            alert("El ID enviado no fue admitido");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.reload();
        }
    } catch (error) {
        console.log("Error al eliminar:", error);
    }
};

// búsqueda en tabla
let searchPedidosTable = () => {
    let valor = searchInput.value.toLowerCase();
    let pedidos = JSON.parse(localStorage.getItem("pedidosTabla")) || [];

    let resultados = pedidos.filter(pedido =>
        (pedido.nombre && pedido.nombre.toLowerCase().includes(valor)) ||
        (pedido.metodo_pago && pedido.metodo_pago.toLowerCase().includes(valor)) ||
        (pedido.estado && pedido.estado.toLowerCase().includes(valor))
    );

    renderPedidosTable(resultados);
};

// colores para método de pago
function getBadgeColor(metodoPago) {
    switch ((metodoPago || "").toLowerCase()) {
        case 'pse': return 'info';
        case 'contraentrega': return 'warning';
        case 'transferencia': return 'success';
        default: return 'secondary';
    }
}

// colores para estado
function getEstadoColor(estado) {
    switch ((estado || "").toLowerCase()) {
        case 'pendiente': return 'warning';
        case 'completado': return 'success';
        case 'cancelado': return 'danger';
        case 'en proceso': return 'info';
        default: return 'secondary';
    }
}