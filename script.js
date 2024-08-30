const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkout = document.getElementById("checkout-btn")
const closeModal = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart =[];


//Abrir Modal
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal();
})

//Fechar Modal 
closeModal.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//Fechar Modal (ClicarFora)
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//AdicionarCarrinho
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})




//Função Add no Carrinho
function addToCart(name, price){
const existingItem = cart.find(item => item.name === name )
if(existingItem){
    existingItem.quantity += 1;
}else{
    cart.push({
        name,
        price,
        quantity: 1,
    })
}

updateCartModal()

}

//Atualiza o Carrinho
function updateCartModal(){
cartItemsContainer.innerHTML = "";
let total = 0;

cart.forEach(item => {
    const cartItemsElement = document.createElement("div");
    cartItemsElement.classList.add("flex" , "justify-between", "mb-4", "flex-col")

    cartItemsElement.innerHTML = `
    
    <div class="flex items-center justify-between">
        <div>
            <p class="font-bold">${item.name}</p>
            <p>Quantidade: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price}</p>
        </div>

        <button class=" hover:text-red-700 remove-from-cart-btn" data-name="${item.name}">
           Remover
        </button>


    </div>
    `

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemsElement)
})

cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});

cartCounter.innerHTML = cart.length;

}


//Função Remover Item Carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart (name)
    }
})


function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


//Endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }


})

//Finalizar
checkout.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "A Hambugueria Dev está fechada, volte mais tarde",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }

    if(cart.length == 0) return;
    if(addressInput.value == ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }

    //Enviar
    const cartItem = cart.map((item) => {
        return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price}|`
        )
    }).join("")

    const message = encodeURIComponent(cartItem)
    const phone = "5511974714465"
    if(addressInput.value != ""){
    window.open(`https://wa.me/${phone}?text=${message}+Enderenço:${addressInput.value}`, "_blank" )
    cart = []
    addressInput.value = ""
    }

    
    updateCartModal();
})


//Aberto ou Fechado
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();


if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}