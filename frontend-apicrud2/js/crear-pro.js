//variables globales del formulario
const d = document;
let nameInput = d.querySelector('#productos-select');
let priceInput = d.querySelector('#precio-pro');
let stockInput = d.querySelector('#stock-pro');
let descripcionInput = d.querySelector('#des-pro');
let imagen = d.querySelector('#imagen-pro');
let btnCreate = d.querySelector('.btn-create');
let productUpdate;
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

//funcion para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    nameUser.textContent = user.usuario;
};

//evento para el boton del logout
btnLogout.addEventListener("click", () =>{
    localStorage.removeItem("userLogin");
    location.href = "./login.html";
});

//evento al boton del formulario
btnCreate.addEventListener('click', () =>{
    let dataProduct = getDataProduct();
    sendDataProduct(dataProduct)
});

//evento al navegador para comprobar si recargo la pagina
d.addEventListener("DOMContentLoaded", ()=>{
    getUser();
    productUpdate = JSON.parse(localStorage.getItem("productEdit"));
    if(productUpdate != null){
        updateDataProduct();
    }
});

//funcion para validar el formulario y
//obtener los datos del formulario
let getDataProduct = () => {
    //validar formulario
    let product;   
    if (nameInput.value && priceInput.value && stockInput.value && descripcionInput.value && imagen.src) {
        product = {
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio: precioInput.value,
            stock: stockInput.value,
            imagen: imagen.src
        }
        precioInput.value = "";
        descripcionInput.value = "";
        stockInput.value = "";
        imagen.src = "https://m.media-amazon.com/images/I/61XV8PihCwL._SY250_.jpg";
        console.log(product);
    }else{
        alert("todos los campos son obligatorios");
    }

    return product;
}; 


//funcion para recibir los datos y
//realizar la peticion al servidor
let sendDataProduct = async (data)=>{
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        }else{
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "../listado-pro.html";
        }
    } catch (error) {
        console.log(error);
    }
};

//funcion para editar el producto
let updateDataProduct = ()=>{
    //agregar datos a editar en los campos del formulario
    nameInput.value = productUpdate.nombre;
    precioInput.value = productUpdate.precio;
    stockInput.value = productUpdate.stock;
    descripcionInput.value = productUpdate.descripcion;
    imagen.src = productUpdate.imagen;
    let product;
    //alternar el boton de crear y editar
    let btnEdit = d.querySelector(".btn-update");
    btnCreate.classList.toggle("d-none");
    btnEdit.classList.toggle("d-none");
    //agregar evento al boton editar
    btnEdit.addEventListener("click",()=>{
        product = {
            id: productUpdate.id,
            nombre: nameInput.value,
            descripcion: descripcionInput.value,
            precio: precioInput.value,
            stock: stockInput.value,
            imagen: imagen.src
        }
        //borrar info de localStorage
        localStorage.removeItem("productEdit");
        //pasar los datos del producto a la funcion
        sendUpdateProduct(product);

    });

};

//funcion para realizar la peticion al servidor
let sendUpdateProduct = async ( pro )=>{
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url,{
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(pro)
        });
        if (respuesta.status === 406) {
            alert("Los datos enviados no son admitidos");
        }else{
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.href = "listado-pro.html";
        }
    } catch (error) {
        console.log(error);
    }
}

