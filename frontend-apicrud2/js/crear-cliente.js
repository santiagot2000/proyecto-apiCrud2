// variables globales del formulario
let d = document;
let nombreInput = d.querySelector('#nombre-cliente');
let apellidoInput = d.querySelector('#apellido-cliente');
let emailInput = d.querySelector('#email-cliente');
let celularInput = d.querySelector('#celular-cliente');
let direccionInput = d.querySelector('#direccion-cliente');
let direccion2Input = d.querySelector('#direccion2-cliente');
let descripcionInput = d.querySelector('#descripcion-cliente');
let btnCreate = d.querySelector('.btn-create');
let btnUpdate = d.querySelector('.btn-update');
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");
let clienteUpdate;

// función para poner el nombre del usuario
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

// evento al botón crear
btnCreate.addEventListener('click', () => {
    let data = getDataCliente();
    if (data) sendDataCliente(data);
});

//evento al navegador para comprobar si recargo la pagina
d.addEventListener("DOMContentLoaded", () => {
    getUser();
    clienteUpdate = JSON.parse(localStorage.getItem("clienteEdit"));
    if (clienteUpdate) {
        updateDataCliente();
    }
});


// obtener datos del formulario
let getDataCliente = () => {
    //validar formulario
    let cliente;
    if (nombreInput.value && apellidoInput.value && emailInput.value && celularInput.value && direccionInput.value) {
        cliente = {
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            celular: celularInput.value,
            direccion: direccionInput.value,
            direccion2: direccion2Input.value || "",
            descripcion: descripcionInput.value || ""
        };
        nombreInput.value = "";
        apellidoInput.value = "";
        emailInput.value = "";
        celularInput.value = "";
        direccionInput.value = "";
        direccion2Input.value = "";
        descripcionInput.value = "";
        console.log(cliente);
    } else {
        alert("Todos los campos son obligatorios.");
    }
    return cliente;
};

// enviar datos al servidor
let sendDataCliente = async (data) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/clientes";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-clientes.html";
        }
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            alert(errorData.message || "Error inesperado.");
            return;
        }
    } catch (error) {
        console.log(error);
    }
};

// cargar datos para editar
let updateDataCliente = () => {
    //agregar datos a editar en los campos del formulario
    nombreInput.value = clienteUpdate.nombre;
    apellidoInput.value = clienteUpdate.apellido;
    emailInput.value = clienteUpdate.email;
    celularInput.value = clienteUpdate.celular;
    direccionInput.value = clienteUpdate.direccion;
    direccion2Input.value = clienteUpdate.direccion2;
    descripcionInput.value = clienteUpdate.descripcion;
    let cliente;
    btnUpdate = d.querySelector('.btn-update');
    btnCreate.classList.toggle("d-none");
    btnUpdate.classList.toggle("d-none");

    btnUpdate.addEventListener("click", () => {
        cliente = {
            id: clienteUpdate.id_cliente,
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            email: emailInput.value,
            celular: celularInput.value,
            direccion: direccionInput.value,
            direccion2: direccion2Input.value,
            descripcion: descripcionInput.value
        };
        //borrar info de localStorage
        localStorage.removeItem("clienteEdit");
        //pasar los datos del producto a la funcion
        sendUpdateCliente(cliente);
    },{ once: true });
};

// enviar actualización
let sendUpdateCliente = async (cliente) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/clientes";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        // Validar antes de intentar leer JSON
        if (!respuesta.ok) {
            let errorText = await respuesta.text(); // leer HTML o mensaje de error
            console.error("Respuesta no válida del servidor:", errorText);
            alert(`Error ${respuesta.status}: No se pudo actualizar el cliente`);
            return;
        }

        let mensaje = await respuesta.json(); // solo si fue OK
        alert(mensaje.message);
        location.href = "listado-clientes.html";

    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
    }
};
