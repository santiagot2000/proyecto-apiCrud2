let d = document;
let rolSelect = d.querySelector('#rol-usuario');
let userInput = d.querySelector('#nombre-usuario-input');
let passInput = d.querySelector('#contrasena-usuario');
let confirmPassInput = d.querySelector('#confirmar-contrasena');
let btnCreate = d.querySelector('.btn-create');
let btnUpdate = d.querySelector('.btn-update');
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");
let userUpdate;

// Función para poner nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    nameUser.textContent = user.usuario;
};

// Evento logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("userLogin");
    location.href = "./login.html";
});

// Evento al botón del formulario
btnCreate.addEventListener('click', () => {
    let dataProduct = getDataUser();
    sendDataUser(dataProduct);
});

// Evento al cargar la página
d.addEventListener("DOMContentLoaded", () => {
    getUser();
    userUpdate = JSON.parse(localStorage.getItem("userEdit"));
    if (userUpdate != null) {
        updateDataUser();
    }
});

// Función para validar y obtener datos del formulario
let getDataUser = () => {
    let user;
    if (rolSelect.value && userInput.value && passInput.value && confirmPassInput.value) {
        if (passInput.value !== confirmPassInput.value) {
            alert("Las contraseñas no coinciden.");
            return null;
        }
        user = {
            rol: rolSelect.value,
            usuario: userInput.value,
            contrasena: passInput.value
        };
    } else {
        alert("Todos los campos son obligatorios.");
        return null;
    }
    return user;
};

// Función para enviar datos al servidor
let sendDataUser = async (data) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-usuarios.html";
        }
    } catch (error) {
        console.log(error);
    }
};

// Función para editar usuario
let updateDataUser = () => {
    rolSelect.value = userUpdate.rol;
    userInput.value = userUpdate.usuario;
    passInput.value = "";
    confirmPassInput.value = "";

    btnCreate.classList.add("d-none");
    btnUpdate.classList.remove("d-none");

    btnUpdate.addEventListener("click", () => {
        let usuario = {
            id: userUpdate.id,
            rol: rolSelect.value,
            usuario: userInput.value,
            contrasena: passInput.value
        };
        localStorage.removeItem("userEdit");
        sendUpdateUser(usuario);
    });
};

// Función para actualizar usuario
let sendUpdateUser = async (pro) => {
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/usuarios";
    try {
        let respuesta = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pro)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-usuarios.html";
        }
    } catch (error) {
        console.log(error);
    }
};