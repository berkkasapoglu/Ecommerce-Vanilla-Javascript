import { createCartElement } from './product.js'
import { getCookie, setCookie } from './cookie.js'
import { data, updateProdBtn, updateSaveBtn } from './app.js'


// ------------------ Cart Actions  ---------------------
// 1.Add item to cart
// 2.Add item to cart
// 3.Add item to cart
// 4.Remove item from cart
// 5.Get item from cartlist(Function)
// 6.Adding html element to cart
// 7.Delete button on cart menu
// 8.Cart menu price functionalities (Updating prices depends on quantity and item price)

const cart = document.querySelector(".cart");
const navbarLinks = document.querySelectorAll(".navbar_link");
const protection = document.querySelector(".protection");
const cartProd = document.querySelectorAll(".cart_body");

const prodSect = document.querySelector(".product_section");
const savedSect = document.querySelector(".saved_section");

export const cartCookieName = 'cartItems';
export const savedCookieName = 'savedItems';

const cartBtn = document.querySelector("#cartBtn"),
    favBtn = document.querySelector("#favBtn");
const btns = [cartBtn, favBtn]
export let savedItems = [];
export let cartItems = [];

// ------------------ Open and Close Cart ---------------------

// Opens Cart Menu
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
    } else {
        cartBtn.classList.add("is-active");
        favBtn.classList.remove("is-active");
        prodSect.classList.add("is-visible");
        savedSect.classList.remove("is-visible");
    }
}

// Close cart menu if click outside of the cart window
const closeCart = (ev) => {
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
}
document.addEventListener('click', closeCart)


// Add item to cart and cookie array
export const addToCart = async function (prodId, cartSection, cartList) {
    data.then((data) => {
        if (cartList.some((item) => item.id === prodId)) {
            console.log("It already exist");
        } else {
            const item = {...data.products.find((product) => product.id === prodId)};
            cartList.push(item);
            if (cartList === cartItems) {
                cartList.at(-1)['quantity'] = 1;
                setCookie(cartCookieName, cartList);
            }
            else if (cartList === savedItems) {
                setCookie(savedCookieName, cartList);
            }
            loadCart(item, cartSection, cartList);
            updateCartNumbers(cartSection);
        }
    })
}

// Removes item from cart
export const removeFromCart = function (prodId, cartSection, cartList) {
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
    //Update cookie items after remove item from cart
    if (cartList === cartItems) {
        setCookie(cartCookieName, cartList);
    }
    else if (cartList === savedItems) {
        setCookie(savedCookieName, cartList);
    }
}

// Get item from cart
const getItem = (prodId, cartList) => {
    return cartList.find((item) => item.id === prodId);
}

// Load item to cart menu
export async function loadCart(item, cartSection, cartList) {
    if (cartList.length) {
        const cartElement = createCartElement(item, cartSection)
        const emptyCart = cartSection.querySelector('.empty_wishlist');
        if (emptyCart) {
            cartSection.children[0].removeChild(emptyCart);
            cartSection.appendChild(cartElement);
        } else {
            cartSection.appendChild(cartElement);
        }
    }
}

// Event Listener to buttons on cart menu (Delete button and input)
for (let section of cartProd) {
    section.addEventListener('click', (ev) => {
        if (ev.target.nodeName === "BUTTON") {
            if (ev.target.closest('.product_section')) {
                const prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
                removeFromCart(prodId, prodSect, cartItems);
                updateProdBtn(prodId);
            } else if (ev.target.closest('.saved_section')) {
                const prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
                removeFromCart(prodId, savedSect, savedItems);
                updateSaveBtn(prodId);
            }
        }
    })
}

// Update quantity of items in cart menu
const prodCount = document.querySelector('.product_section');

const updateCartPrice = (ev) => {
    const prodId = parseInt(ev.target.closest('[data-id]').dataset.id)
    let prodPrice = getItem(prodId, cartItems).price;
    let itemQuantity = ev.target.value;
    ev.target.previousSibling.children[0].textContent = prodPrice * itemQuantity;
    getItem(prodId, cartItems).quantity = parseInt(ev.target.value);

}

// Update items quantity and total price in cart menu
const updateCartNumbers = async (cartSection) => {
    const savedHeader = favBtn.querySelector("#savedItemSize");
    const cartHeader = cartBtn.querySelector("#cartItemSize");
    const totalPrice = document.querySelector('#totalPrice');

    if (cartSection.classList.contains('saved_section')) {
        savedHeader.innerText = savedItems.length;
        totalPrice.innerText = savedItems.reduce((init, item) => init += item.price, 0)
    } else {
        cartHeader.innerText = cartItems.length;
        totalPrice.innerText = cartItems.reduce((init, item) => init += (item.price * item.quantity), 0)
    }
}

// When page first open get item quantity in cart list 
// and set previously updated cart item quantities.
export const updateCartQuantities = (prodId) => {
    const cartProds = document.querySelectorAll('.product_section .cart_item');
    cartProds.forEach(item => {
        const itemQuantity = item.querySelector('.product-count');
        if (parseInt(item.dataset.id) === prodId) {
            itemQuantity.value = getItem(prodId, cartItems).quantity
        }
    })
}
// ---------------------------------------

// If click change Cart and Favourites toggle buttons style on cart menu
export const switchBtns = function () {
    if (!this.classList.contains('is-active')) {
        this.classList.add('is-active');
        if (this.id === "cartBtn") {
            prodSect.classList.add("is-visible");
            savedSect.classList.remove("is-visible");
        } else {
            savedSect.classList.add('is-visible');
            prodSect.classList.remove("is-visible");
        }
        for (let btn of btns) {
            if (btn != this) btn.classList.remove('is-active');
        }
    }
}

// Cart event listeners
prodCount.addEventListener('change', (ev) => {
    updateCartPrice(ev)
    updateCartNumbers(prodSect)
    setCookie(cartCookieName, cartItems)
});


for (let link of navbarLinks) {
    link.addEventListener('click', openCart);
}
favBtn.addEventListener('click', switchBtns);
cartBtn.addEventListener('click', switchBtns);

export const loadCartElements = async () => {
    cartItems = getCookie(cartCookieName);
    savedItems = getCookie(savedCookieName);
    
    cartItems.forEach(item => {
        loadCart(item, prodSect, cartItems)
        updateProdBtn(item.id)
        updateCartQuantities(item.id)
        updateCartNumbers(prodSect)
    });
    savedItems.forEach(item => {
        loadCart(item, savedSect, savedItems)
        updateSaveBtn(item.id)
        updateCartNumbers(savedSect)
    });
}

