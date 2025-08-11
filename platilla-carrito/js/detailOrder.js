// variables gloobales
let tableCart = document.querySelector(".cart-table tbody")
let tagSubtotal = document.querySelector(".cart-summary .sub-total");
let tagTotal = document.querySelector(".cart-summary .total");
let tagDelivery = document.querySelector(".cart-summary .valor-domi");
let tagPromo = document.querySelector(".cart-summary .promo");

//evento para recargar el navegador
document.addEventListener("DOMContentLoaded", function() {
    getProductCart();
});

// detalle de la compra
let updateOrderDetail = ()=>{
    let subtotal = 0;
    
}

// funcion para manejar la cantidad de productos
let infoOrder = (pos)=>{
    let countProduct = document.querySelectorAll(".quantity input.number");
    let btnDecrement = document.querySelectorAll(".decrement i");
    let btnIncrement = document.querySelectorAll(".increment i");
    let totalPro = document.querySelectorAll(".total-pro");

    // evento a los botones + y -
    let newValuePro = Number(totalPro[pos].textContent);
    btnIncrement[pos].addEventListener("click",()=>{
        let currentValue = Number(countProduct[pos].value);
        countProduct[pos].value = currentValue + 1;
        totalPro[pos].textContent = newValuePro + Number(totalPro[pos].textContent);
        console.log(currentValue)
        updateOrderDetail();
    });

    btnDecrement[pos].addEventListener("click",()=>{
        let currentValue = Number(countProduct[pos].value);
        if (currentValue > 1){
            countProduct[pos].value = currentValue - 1;
            totalPro[pos].textContent = Number(totalPro[pos].textContent) - newValuePro;
        }
        
        console.log(currentValue)
    })



    // mostrar en colsola las variable
    //console.log(countProduct[pos]);
}


//funcion para obtener los productos del carrito
let getProductCart = ()=>{
    let product = [];
    let productsLocal = JSON.parse(localStorage.getItem("carrito"))
    if (productsLocal != null){
        product = Object.values(productsLocal);
    }
    // mostarr productos de localStorage en colsole
    console.log(product);
    product.forEach((dato, i)=>{
        let row = document.createElement("tr")
        row.innerHTML = `
            <td class="product-block">
                <a href="#" class="remove-from-cart-btn"><i class="fa-solid fa-x"></i></a>
                <img src="${dato.imagen}" alt="">
                <a href="product-detail.html" class="h6">${dato.nombre}</a>
            </td>
            <td>
                <p class="lead color-black">$${dato.precio}</p>
            </td>
            <td>
                <div class="quantity quantity-wrap">
                    <div class="decrement"><i class="fa-solid fa-minus"></i></div>
                    <input type="text" name="quantity" value="1" maxlength="2" size="1" class="number">
                    <div class="increment"><i class="fa-solid fa-plus"></i></div>
                </div>
            </td>
            <td>
                <h6 class="total-pro">${dato.precio}</h6>
            </td>
        `;
        tableCart.appendChild(row);
        infoOrder(i);
    })
};