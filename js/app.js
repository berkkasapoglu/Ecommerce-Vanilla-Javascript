import { setCookie, getCookie } from './cookie.js'
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

// ----------------- Get and Display Data ----------------------

//Get all products
const fetchProductData = async function () {
    try {
        const response = await fetch("./data/products.json")
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const data = fetchProductData();
//Load products into the product section.
export const loadProducts = async function (products) {
    while (prods.firstChild && prods.removeChild(prods.firstChild));
    for (let prod of products) {
        const prodElement = createProductElement(prod);
        prods.appendChild(prodElement);
    }
};

// ----------------  Update style of buttons on products -----------------------

// Update button style(Product Add Cart buttom) 
export const updateProdBtn = (prodId) => {
    const prod = [...prods.children].find((el) => parseInt(el.dataset.id) === prodId)
    const prodBtn = prod.querySelector('#addCart')
    let btnFlag = parseInt(prodBtn.value);
    if (!btnFlag) {
        prodBtn.innerText = "Added";
        prodBtn.classList.remove("btn-primary");
        prodBtn.classList.add("is-added");
        prodBtn.value = 1;
    } else {
        prodBtn.innerText = "Add To Cart";
        prodBtn.classList.add("btn-primary");
        prodBtn.classList.remove("is-added");
        prodBtn.value = 0;
    }
}

// Update button style(Product Add Favourite section buttom) 
export const updateSaveBtn = (prodId) => {
    const prod = [...prods.children].find((el) => parseInt(el.dataset.id) === prodId)
    const saveBtn = prod.querySelector('#addSaved')
    let btnFlag = parseInt(saveBtn.value);
    if (!btnFlag) {
        saveBtn.value = 1;
        saveBtn.classList.remove('far');
        saveBtn.classList.add('fas');
    } else {
        saveBtn.value = 0;
        saveBtn.classList.remove('fas');
        saveBtn.classList.add('far');
    }
}

// ---------------- Production event listeners -----------------------
//Add event listeners to production buttons
prods.addEventListener('click', function (ev) {
    const prodItem = [...prods.children].find((element) => {
        return element === ev.target.closest('[data-id]')
    })
    const prodId = parseInt(prodItem.dataset.id);
    const prodBtn = prodItem.querySelector('#addCart');
    const addFavBtn = prodItem.querySelector('#addSaved');
    if (ev.target.nodeName === "BUTTON") {
        if (!parseInt(prodBtn.value)) {
            addToCart(prodId, prodSect, cartItems);
            updateProdBtn(prodId)
        }
        else {
            removeFromCart(prodId, prodSect, cartItems);
            updateProdBtn(prodId)
        }
    } else if (ev.target.nodeName === "I") {
        if (!parseInt(addFavBtn.value)) {
            addToCart(prodId, savedSect, savedItems);
            updateSaveBtn(prodId)
        }
        else {
            removeFromCart(prodId, savedSect, savedItems);
            updateSaveBtn(prodId)
        }
    }
})

// ---------------------------------------
// If click change Cart and Favourites toggle buttons style on cart menu
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
        updateCartNumbers(savedSect);
    } else {
        cartBtn.classList.add("is-active");
        favBtn.classList.remove("is-active");
        prodSect.classList.add("is-visible");
        savedSect.classList.remove("is-visible");
        updateCartNumbers(prodSect);
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

// ------------------ Cart Actions  ---------------------
// 1.Add item to cart
// 2.Remove item from cart
// 3.Get item from cartlist(Function)
// 4.Adding html element to cart
// 5.Delete button on cart menu
// 6.Cart menu price functionalities (Updating prices depends on quantity and item price)

let savedItems = [];
let cartItems = [];

// Add item to cart and cookie array
export const addToCart = async function (prodId, cartSection, cartList) {
    data.then((data) => {
        if (cartList.some((item) => item.id === prodId)) {
            console.log("It already exist");
        } else {
            const item = data.products.find((product) => product.id === prodId);
            cartList.push(item);
            if (cartList === cartItems) {
                item['quantity'] = 1;
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
export let cartCookieName = 'cartItems';
export let savedCookieName = 'savedItems';
async function loadCart(item, cartSection, cartList) {
    if(cartList.length) {
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
    let resultsPrice = (prodPrice / (itemQuantity - 1)) * (itemQuantity);
    ev.target.previousSibling.children[0].textContent = resultsPrice

    getItem(prodId, cartItems).price = resultsPrice;
    getItem(prodId, cartItems).quantity = parseInt(ev.target.value);
}

prodCount.addEventListener('change', (ev) => {
    updateCartPrice(ev)
    updateCartNumbers(prodSect)
    setCookie(cartCookieName, cartItems)
});

// Update items size in cart header and total price
const updateCartNumbers = async (cartSection) => {
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

// When page first open get item quantity in cart list 
// and update previous cart item quantities.
const updateCartQuantities = (prodId) => {
    const cartProds = document.querySelectorAll('.product_section .cart_item');
    cartProds.forEach(item => {
        const itemQuantity = item.querySelector('.product-count');
        if(parseInt(item.dataset.id) === prodId) {
            itemQuantity.value = getItem(prodId, cartItems).quantity
        }
    })
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
                        updateProdBtn(cookie.id)
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

// ----------------- Load All Elements from cookies  ----------------------
// Load cart items from cookies after page loads
window.addEventListener('DOMContentLoaded', async () => {
    await data.then((data) => loadProducts(data.products));
    cartItems = getCookie(cartCookieName);
    savedItems = getCookie(savedCookieName);

    cartItems.forEach(item => {
        loadCart(item, prodSect, cartItems)
        updateProdBtn(item.id)
        updateCartQuantities(item.id)});
    savedItems.forEach(item => {
        loadCart(item, savedSect, savedItems)
        updateSaveBtn(item.id)});

})