// variables globales
let tableClientes = document.querySelector("#table-clientes tbody");
let searchInput = document.querySelector("#search-input");
let nameUser = document.querySelector("#nombre-usuario");
let btnLogout = document.querySelector("#btnLogout");


// función para poner nombre de usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    if (user) {
        nameUser.textContent = user.usuario;
    } else {
        location.href = "./login.html";
    }
};

//evento para el boton del logout
btnLogout.addEventListener("click", () => {
    if (confirm("¿Estás seguro de cerrar sesión?")) {
    localStorage.removeItem("userLogin");
    location.href = "./login.html";
    }
});

//evento para probar el campo de buscar
searchInput.addEventListener("keyup", () => {
    searchClienteTable();
});

//evento al navegador para comprobar si recargo la pagina
document.addEventListener("DOMContentLoaded", () => {
    getTableDataClientes();
    getUser();
});

//funcion para traer los datos de la BD a la tabla
let getTableDataClientes = async () => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/clientes";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (respuesta.status === 204) {
            console.log("No hay clientes en la BD");
        } else {
            let data = await respuesta.json();
            //agregar los datos de la tabla a localStorage
            localStorage.setItem("clientesTabla", JSON.stringify(data));
            //agregar los datos a la tabla
            data.forEach((cliente, i) => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.celular}</td>
                    <td>${cliente.direccion}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editCliente(${i})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCliente(${i})">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-sm btn-info btn-view" data-id="2">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                tableClientes.appendChild(row);
            });
        }
    } catch (error) {
        console.log(error);
    }
};

//funcion para editar algun producto de la tabla
let editCliente = (pos) => {
    let clientes = JSON.parse(localStorage.getItem("clientesTabla")) || [];
    let cliente = clientes[pos];
    localStorage.setItem("clienteEdit", JSON.stringify(cliente));
    location.href = "crear-cliente.html";
};

//funcion para eliminar algun dato de la tabla
let deleteCliente = async (pos) => {
    let clientes = [];
    let clientesSave = JSON.parse(localStorage.getItem("clientesTabla"));
    if (clientesSave != null) {
        clientes = clientesSave;
    }
    let singleProduct = clientes[pos];
    let IDProduct = {
        id: singleProduct.id
    }
    let confirmar = confirm(`¿Deseas eliminar ${singleProduct.nombre} ?`);
    if (confirmar) {
        //llamar la funcion para realziar la peticion
        sendDeleteClientes( IDProduct );
    }
};

//funcion para realizar la peticion de eliminar un producto
let sendDeleteClientes = async ( id )=>{
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/clientes";
    try {
        let respuesta = await fetch(url,{
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({ id: id })
        });
        if (respuesta.status === 406) {
            alert("El ID enviado no fue admitido");
        }else{
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

//funcion para quitar productos de la tabla
let clearDataTable = ()=>{
    let rowTable = document.querySelectorAll("#table-clientes tbody > tr");
    rowTable.forEach((row)=>{
        row.remove();
    });
};

//funcion para buscar un product de la tabla
let searchClienteTable = ()=>{
    let clientes = JSON.parse(localStorage.getItem("clientesTabla")) || [];
    let textSearch = searchInput.value.toLowerCase();
    clearDataTable();
    clientes.forEach((cliente, i) => {
        if (cliente.nombre.toLowerCase().includes(textSearch)) {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.email}</td>
                <td>${cliente.celular}</td>
                <td>${cliente.direccion}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editCliente(${i})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCliente(${i})">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-info btn-view" data-id="2">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tableClientes.appendChild(row);
        }
    });
};
