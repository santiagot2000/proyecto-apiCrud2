// variables globales
let tableUsuarios = document.querySelector("#table-usuarios tbody");
let searchInput = document.querySelector("#search-input");
let nameUser = document.querySelector("#nombre-usuario");
let btnLogout = document.querySelector("#btnLogout");
let usuarios = [];

// Función para poner nombre del usuario
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

// evento para buscar en la tabla
searchInput.addEventListener("keyup", () => {
    searchUserTable();
});

// Evento al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    getUser();
    getTableData();
});

// Cargar usuarios
let getTableData = async () => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (respuesta.status === 204) {
            console.log("No hay datos en la BD");
        } else {
            usuarios = await respuesta.json();
            renderUsuarios(usuarios);
        }
    } catch (error) {
        console.log(error);
    }
};

// Renderizar usuarios
let renderUsuarios = (data) => {
    tableUsuarios.innerHTML = "";
    data.forEach((usr, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td><span class="badge badge-${getBadgeColor(usr.rol)}">${usr.rol}</span></td>
            <td>${usr.usuario}</td>
            <td><span class="badge badge-success">Activo</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarUsuario(${i})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${i})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableUsuarios.appendChild(row);
    });
};

// Editar usuario
let editarUsuario = (index) => {
    localStorage.setItem("userEdit", JSON.stringify(usuarios[index]));
    location.href = "crear-usuario.html";
};

// Eliminar usuario
let eliminarUsuario = async (index) => {
    let usuario = usuarios[index];
    if (!confirm(`¿Deseas eliminar al usuario "${usuario.usuario}"?`)) return;

    try {
        let respuesta = await fetch("http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: usuario.id })
        });
        let mensaje = await respuesta.json();
        alert(mensaje.message);
        getTableData(); // Recargar tabla
    } catch (error) {
        console.log(error);
    }
};

// Buscar usuario
let searchUserTable = () => {
    let texto = searchInput.value.toLowerCase();
    let filtrados = usuarios.filter(u =>
        u.usuario.toLowerCase().includes(texto) ||
        u.rol.toLowerCase().includes(texto)
    );
    renderUsuarios(filtrados);
};

// Colores según rol
let getBadgeColor = (rol) => {
    switch (rol) {
        case 'administrador': return 'danger';
        case 'vendedor': return 'primary';
        case 'cajero': return 'success';
        default: return 'secondary';
    }
};
