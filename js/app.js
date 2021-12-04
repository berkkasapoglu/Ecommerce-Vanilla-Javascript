import { getCookie } from './cookie.js'
import { createProductElement } from './product.js'
import { cartCookieName, savedCookieName } from './cart.js'
import { addToCart, removeFromCart, cartItems, savedItems, loadCartElements } from './cart.js'

let prods = document.querySelector(".products");

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

// ----------------- Filter ----------------------

//Filter items by category
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
            cartCookie.forEach(cookie => updateProdBtn(cookie.id))
            savedCookie.forEach(cookie => updateSaveBtn(cookie.id))
        
        } else {
            data.then(async (data) => {
                const filteredData = await filterData(data.products, ev.target.value)
                await loadProducts(filteredData);
                const filteredCartCookies = filterData(cartCookie, ev.target.value);
                const filteredSavedCookies = filterData(savedCookie, ev.target.value);
                filteredCartCookies.forEach(cookie => updateProdBtn(cookie.id))
                filteredSavedCookies.forEach(cookie => updateSaveBtn(cookie.id))
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
    loadCartElements();
})