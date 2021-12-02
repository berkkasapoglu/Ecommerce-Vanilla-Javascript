import { setCookie, addCookiesToCart, getCookie } from './cookie.js'
import { createProductElement, createCartElement } from './product.js'

let prods = document.querySelector(".products");

let protection = document.querySelector(".protection"),
    cartBtn = document.querySelector("#cartBtn"),
    favBtn = document.querySelector("#favBtn");

const btns = [cartBtn, favBtn]

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
export const data = fetchProductData();

// ---------------------------------------
//Load products into the product section.
export const loadProducts = async function (products) {
    while (prods.firstChild && prods.removeChild(prods.firstChild));
    for (let prod of products) {
        const prodElement = createProductElement(prod);
        prods.appendChild(prodElement);
    }
};
// ---------------------------------------

export const updateProdBtn = async (prodId, cartType) => {
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
    } else {
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
const savedItems = [];
const cartItems = [];

// Add item to cart
export const addToCart = async function (prodId, cartSection, cartList) {
    data.then((data) => {
        if (cartList.some((item) => item.id === prodId)) {
            console.log("It already exist");
        } else {
            const item = data.products.find((product) => product.id === prodId);
            cartList.push(item);
            if (cartList === cartItems) {
                setCookie(cartCookieName, cartList);
            }
            else if (cartList === savedItems) {
                setCookie(savedCookieName, cartList);
            }

            const cartElement = createCartElement(item)
            const emptyCart = cartSection.querySelector('.empty_wishlist');
            console.log(cartSection.children)
            if (emptyCart) {
                cartSection.children[0].removeChild(emptyCart);
                cartSection.appendChild(cartElement);
            } else {
                cartSection.appendChild(cartElement);
            }
            updateCartNumbers(cartSection);
        }
    })
}
// ----------------    Cookies   -----------------------
const cartInfo = ['#addCart', prodSect, cartItems]
const savedInfo = ['#addSaved', savedSect, savedItems]
export let cartCookieName = 'cartItems';
export let savedCookieName = 'savedItems';
async function loadCookies() {
    await data.then((data) => loadProducts(data.products));
    addCookiesToCart(cartCookieName, ...cartInfo);
    addCookiesToCart(savedCookieName, ...savedInfo);
}
loadCookies();

// ---------------------------------------
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
    //Set cookie items after remove item from cart
    if (cartList === cartItems) {
        setCookie(cartCookieName, cartList);
    }
    else if (cartList === savedItems) {
        setCookie(savedCookieName, cartList);
    }
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
"javascript:alert('test');\" xxx=\"maliciousCode3000\""
// Update items size in cart header and total price
const updateCartNumbers = (cartSection) => {
    const savedHeader = favBtn.querySelector("#savedItemSize");
    const cartHeader = cartBtn.querySelector("#cartItemSize");
    const totalPrice = document.querySelector('#totalPrice');

    if (cartSection.classList.contains('saved_section')) {
        savedHeader.innerText = savedItems.length;
        totalPrice.innerText = savedItems.reduce((init, item) => init += item.price, 0)
    } else {
        cartHeader.innerText = cartItems.length;
        totalPrice.innerText = cartItems.reduce((init, item) => init += item.price, 0)
    }
}


for (let link of navbarLinks) {
    link.addEventListener('click', openCart);
}
favBtn.addEventListener('click', switchBtns);
cartBtn.addEventListener('click', switchBtns);

const cartTypes = ['#addCart', '#addSaved']
// -----------------  Filter Buttons ----------------------
const filterData = (data, category) => {
    return data.filter((item) => item.category === category)
}

// Filter products depends on clicked button
const filterBtns = document.querySelector('.filters');
const filterCategory = async (ev) => {
    if (ev.target.nodeName === 'BUTTON' && !ev.target.classList.contains('filter-selected')) {
        const cartCookie = getCookie(cartCookieName)
        const savedCookie = getCookie(savedCookieName)
        if (ev.target.value === 'All') {
            await data.then((data) => loadProducts(data.products));
            let type = 0;
            for (let cookies of [cartCookie, savedCookie]) {
                for (let cookie of cookies) {
                    updateProdBtn(cookie.id, cartTypes[type])
                }
                type += 1;
            }
        }
        else {
            await data.then((data) => {
                const filteredData = filterData(data.products, ev.target.value)
                loadProducts(filteredData);
                const filteredCartCookies = filterData(cartCookie, ev.target.value);
                const filteredSavedCookies = filterData(savedCookie, ev.target.value);
                let type = 0;
                for (let cookies of [filteredCartCookies, filteredSavedCookies]) {
                    for (let cookie of cookies) {
                        updateProdBtn(cookie.id, cartTypes[type])
                    }
                    type += 1;
                }
            })
        }

        const filterBtn = [...filterBtns.children].find((item) => {
            return item.classList.contains('filter-selected');
        })
        filterBtn.classList.remove('filter-selected');
        ev.target.classList.add('filter-selected');
    }
}

filterBtns.addEventListener('click', filterCategory);