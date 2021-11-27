let prods = document.querySelector(".products");
let toggle = document.querySelector("#toggleBar");
let toggleBar = document.querySelector(".toggle_bar");


let protection = document.querySelector(".protection");
let cartBtn = document.querySelector("#cartBtn");
let favBtn = document.querySelector("#favBtn");
const btns = [cartBtn, favBtn];

let cart = document.querySelector(".cart");
let navbarLinks = document.querySelectorAll(".navbar_link");


let cartProd = document.querySelectorAll(".cart_body");
let prodSect = document.querySelector(".product_section");
let savedSect = document.querySelector(".saved_section");

const fetchProductData = async function () {
    const response = await fetch("./data/products.json")
    const data = await response.json();
    return data;
}
// ---------------------------------------
const loadProducts = async function () {
    fetchProductData()
        .then(data => {
            for (let prod of data.products) {
                let htmlText = `<div class="product" data-id=${prod.id}>
                            <img src=${prod.image} alt="" class="product_image">
                            <h4 class="product_header">${prod.title}</h4>
                            <div>
                                <i class="fa fa-star checked"></i>
                                <i class="fa fa-star checked"></i>
                                <i class="fa fa-star checked"></i>
                                <i class="fa fa-star checked"></i>
                                <i class="far fa-star"></i>
                            </div>
                            
                            <p class="product_price">$${prod.price}</p>
                            
                            <div class="row align-center" id="addCartBtns">
                                <button class="btn btn-primary" id="addCart" value=0>Add to Cart</button>
                                <i class="far fa-heart" id="addSaved" value=0></i>
                            </div>
                        </div>`;
                prods.insertAdjacentHTML('beforeend', htmlText);
            }

        })
};
loadProducts();
const updateProdBtn = (prodId, cartType) => {
    const prodBtns = prods.querySelectorAll(cartType);
    const prodBtn = [...prodBtns].find((el) => parseInt(el.closest('[data-id]').dataset.id) === prodId)
    let btnFlag = parseInt(prodBtn.value);
    if (cartType === '#addCart') {
        prodBtn.classList.toggle("btn-primary");
        prodBtn.classList.toggle("is-added");
        if (!btnFlag) {
            prodBtn.innerText = "Added";
            prodBtn.value = 1;
        } else {
            prodBtn.innerText = "Add To Cart";
            prodBtn.value = 0;
        }
    } else if (cartType === '#addSaved') {
        if (!btnFlag) {
            prodBtn.value = 1;
            prodBtn.classList.remove('far');
            prodBtn.classList.add('fas');
        } else {
            prodBtn.value = 0;
            prodBtn.classList.remove('fas');
            prodBtn.classList.add('far');
        }
    }
}


// ---------------------------------------
let cartType;
prods.addEventListener('click', function (ev) {

    const prodItems = prods.querySelectorAll(".product")
    const prodItem = [...prodItems].find((element) => {
        return element === ev.target.closest('[data-id]')
    })
    const prodId = parseInt(prodItem.dataset.id);
    const prodBtn = prodItem.querySelector('#addCart');
    const addFavBtn = prodItem.querySelector('#addSaved');
    if (ev.target.nodeName === "BUTTON") {
        cartType = '#addCart';
        if (!parseInt(prodBtn.value)) {
            addToCart(prodId, prodSect, cartItems);
            updateProdBtn(prodId, cartType);
        }
        else {
            removeFromCart(prodId, prodSect, cartItems);
            updateProdBtn(prodId, cartType);
        }
    } else if (ev.target.nodeName === "I") {
        cartType = '#addSaved';
        if (!parseInt(addFavBtn.value)) {
            addToCart(prodId, savedSect, savedItems);
            updateProdBtn(prodId, cartType);
        }
        else {
            removeFromCart(prodId, savedSect, savedItems);
            updateProdBtn(prodId, cartType);
        }
    }
})
// ---------------------------------------

const toggleMove = function () {
    if (toggleBar.style.top != '0px') {
        toggleBar.style.top = 0;
        protection.style.opacity = .4;
    }
    else {
        toggleBar.style.top = '-1000px';
        protection.style.opacity = 0;
    }
}
// ---------------------------------------

const switchBtns = function () {
    if (!this.classList.contains('is-active')) {
        this.classList.add('is-active');
        if (this.id === "cartBtn") {
            prodSect.classList.add("is-visible");
            savedSect.classList.remove("is-visible");
            updateCartNumbers(prodSect);
        } else {
            savedSect.classList.add('is-visible');
            prodSect.classList.remove("is-visible");
            updateCartNumbers(savedSect);
        }
        for (let btn of btns) {
            if (btn != this) btn.classList.remove('is-active');
        }
    }
}


// ---------------------------------------

// Opens Cart
const openCart = function (ev) {
    ev.preventDefault();
    cart.classList.add("openCart");
    document.body.classList.add("no-scroll");
    protection.style.opacity = .4;
    protection.style.pointerEvents = "all";
    if (ev.target.id == 'favouriteMenu') {
        cartBtn.classList.remove("is-active");
        favBtn.classList.add("is-active");
        savedSect.classList.add("is-visible");
        prodSect.classList.remove("is-visible");
        updateCartNumbers(savedSect);
    }
    else {
        cartBtn.classList.add("is-active");
        favBtn.classList.remove("is-active");
        prodSect.classList.add("is-visible");
        savedSect.classList.remove("is-visible");
        updateCartNumbers(prodSect);
    }
}
// ---------------------------------------
// Close cart page if click outside of the cart window.
document.addEventListener('click', function (ev) {
    const clickCart = (ev.path.some((item) => {
        try {
            return item.classList.contains("cart");
        } catch {
            return
        }
    }))
    if (!ev.target.classList.contains("navbar_link"))
        if (!clickCart) {
            cart.classList.remove("openCart");
            document.body.classList.remove("no-scroll");
            protection.style.opacity = 0;
            protection.style.pointerEvents = "none";
        }
})
// ---------------------------------------
let savedItems = [];
let cartItems = [];
// Add item to card
const addToCart = function (prodId, cartSection, cartList) {
    fetchProductData()
        .then(data => {
            if (cartList.some((item) => item.id === prodId)) {
                console.log("It already exist");
            } else {
                const item = data.products.find((product) => product.id === prodId);
                cartList.push(item);

                htmlText = `<div class="cart_item row" data-id=${item.id}>
            <img class="cart_image" src=${item.image} alt="">
            <h4 class="cart_header">${item.title}</h4>
            <div>
                <i class="fa fa-star checked"></i>
                <i class="fa fa-star checked"></i>
                <i class="fa fa-star checked"></i>
                <i class="fa fa-star checked"></i>
                <i class="far fa-star"></i>
            </div>
            <p class="cart_price"><span>${item.price}</span>$</p>
            <button class="delete_btn" id="deleteItem">Delete</button>
            </div>`

                if (cartSection.querySelector('.empty_wishlist')) {
                    cartSection.innerHTML = "";
                    cartSection.innerHTML += htmlText;
                } else {
                    cartSection.innerHTML += htmlText;
                }
                updateCartNumbers(cartSection);
            }
        })
}
// ---------------------------------------

// Removes item from card
const removeFromCart = function (prodId, cartSection, cartList) {
    let delBtns;
    if (cartSection.classList.contains('product_section')) {
        delBtns = document.querySelectorAll('.product_section #deleteItem')
    }
    else delBtns = document.querySelectorAll('.saved_section #deleteItem')

    const removedItem = [...delBtns].find((element) => {
        return parseInt(element.closest('[data-id]').dataset.id) === prodId;
    })
    removedItem.parentElement.remove();
    const removedItemId = cartList.find((element) => element.id === prodId);
    cartList.splice(cartList.indexOf(removedItemId), 1);
    updateCartNumbers(cartSection);
}

// Event Listener to delete button on cart
for (let section of cartProd) {
    section.addEventListener('click', (ev) => {
        if (ev.target.nodeName === "BUTTON") {
            if (ev.target.closest('.product_section')) {
                const prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
                removeFromCart(prodId, prodSect, cartItems);
                cartType = '#addCart';
                updateProdBtn(prodId, cartType);
            } else if (ev.target.closest('.saved_section')) {
                cartType = '#addSaved';
                const prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
                removeFromCart(prodId, savedSect, savedItems);
                updateProdBtn(prodId, cartType);
            }
        }
    })
}

// Update items size in cart header and total price
const updateCartNumbers = (cartSection) => {
    const savedHeader = favBtn.querySelector("#savedItemSize");
    const cartHeader = cartBtn.querySelector("#cartItemSize");
    const totalPrice = document.querySelector('#totalPrice');

    if (cartSection.classList.contains('saved_section')) {
        savedHeader.innerText = savedItems.length;
        totalPrice.innerText = savedItems.reduce((init,item) => init+=item.price,init=0)
    } else {
        cartHeader.innerText = cartItems.length;
        totalPrice.innerText = cartItems.reduce((init,item) => init+=item.price,init=0)
    }
}


for (let link of navbarLinks) {
    link.addEventListener('click', openCart);
}
favBtn.addEventListener('click', switchBtns);
cartBtn.addEventListener('click', switchBtns);
toggle.addEventListener('click', toggleMove);




