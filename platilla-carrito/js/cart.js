// variables globales
let iconCart = document.querySelector(".carrito");
let iconCount = document.querySelector(".contar-pro");
let btnProducts = document.querySelectorAll(".btn-product");
let contentProducts = document.querySelector(".content-pro");
let listCart = document.querySelector(".list-cart tbody");
let btnCart = document.querySelector(".btn-cart");
let con = 1;

// evento al navegador para cargar los documentos
document.addEventListener("DOMContentLoaded", ()=>{
    getProductData();
})

// agrgar evento al icono del carrito para mostrar o ocular el contenido del carrito
iconCart.addEventListener("click", ()=>{
    if(listCart.parentElement.style.display == "none"){
        listCart.parentElement.style.display = "block";
    }else{
        listCart.parentElement.style.display = "none";
    }
});

// funcion para obtener la informacion del producto
let getInfoProduc = (id) => {
    let products = [];
    let productPrevius = JSON.parse(localStorage.getItem("productos"));
    if(productPrevius != null){
        products = Object.values(productPrevius);
    }
    //console.log(products[id])
    // llamar funcion addProCart
    addProCart(products[id]);
    // agregar evento al boton ver carrito
    btnCart.addEventListener("click", ()=>{
        storageProduct(products[id]); // pasando producto a la funcion
    })
    //alert("Producto agregado al carrito");
    iconCount.textContent = con;
    con++;
};

// funcion para guardar los productos del carrito en localStorage
let storageProduct = (product) =>{
    let products = [];
    let productPrevius = JSON.parse(localStorage.getItem("carrito"));
    if(productPrevius != null){
        products = Object.values(productPrevius);
    }
    products.push(product);
    localStorage.setItem("carrito", JSON.stringify(products));
    location.href = "cart.html"; //redirigir a la pagina del carrito
}


// funcion para llevar la info del producto al carrito
let addProCart = (prod) =>{
    // crear un div para el producto
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${con} </td>
        <td><img src="${prod.imagen}" width="80px"></td>
        <td>${prod.nombre}</td>
        <td>$${prod.precio}</td>
        <td>
            <button onclick="deleteCart(${con})" type="button" class="btn-delete btn text-danger">x</button>
        </td>      
    `;
    // agregar el div al carrito
    listCart.appendChild(row);
}

// funcion para eliminar un producto del carrito
let deleteCart = (id)=>{
    let btnEliminar = document.querySelectorAll(".btn-delete");
    btnEliminar[(id-1)].parentElement.parentElement.remove();
    console.log(btnEliminar[id-1])
    if(Number(iconCount.textContent)> 0){
        iconCount.textContent = Number(iconCount.textContent) - 1;
    }
}

//funcion para traer los datos de la BD a la tienda
let getProductData = async ()=>{
    let url = "http://localhost/proyecto-apiCrud/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url,{
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });
        if (respuesta.status === 204) {
           console.log("No hay datos en la BD");
        }else{
            let tableData = await respuesta.json();
            console.log(tableData);
            //agregar los datos de la tabla a localStorage
            localStorage.setItem("productos", JSON.stringify(tableData));
            //agregar los datos a la tabla
            tableData.forEach((dato, i)=>{
                
                contentProducts.innerHTML += `
                    <div class="col-md-3 py-3 py-md-0">
                        <div class="card">
                        <img src="${dato.imagen}" alt="">
                            <div class="card-body">
                                <h3>${dato.nombre}</h3>
                                <p>${dato.descripcion}</p>
                                <h5>$${dato.precio} 
                                    <span class="btn-product" onclick="getInfoProduc(${i})"><i class="fa-solid fa-basket-shopping"></i></span>
                                </h5>
                            </div>
                        </div>
                    </div>
                `;
            });
           
        }
    } catch (error) {
        console.log(error);
    }

};