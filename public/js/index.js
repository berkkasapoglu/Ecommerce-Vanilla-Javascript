import Cart from './cart.js'
import { createCartElement, createInputElement, createButtonElement } from './product.js'

const cartWindow = document.querySelector('.cart');
const totalPrice = document.querySelector('#totalPrice');

const cartLink = document.querySelector('#cartLink');
const wishLink = document.querySelector('#wishLink');
const switchCartBtn = document.querySelector('#cartBtn');
const switchWishBtn = document.querySelector('#wishBtn');

const protection = document.querySelector('.protection');
const wishBodyEl = document.querySelector('.wish-section');
const cartBodyEl = document.querySelector('.cart-section');

const cart = new Cart();
const wish = new Cart();
//Get item from database according to product id
const getItem = async (id) => {
    const res = await fetch(`/data/${id}`)
    const data = await res.json()
    return data;
}

//  Open Cart 
const openCart = (ev) => {
    ev.preventDefault();
    cartWindow.classList.add("is-opened");
    document.body.classList.add("no-scroll");
    protection.style.opacity = .4;
    protection.style.pointerEvents = "all";
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
    if (!ev.target.classList.contains("navbar-link"))
        if (!clickCart) {
            cartWindow.classList.remove("is-opened");
            protection.style.opacity = 0;
            protection.style.pointerEvents = "none";
        }
}

protection.addEventListener('click', closeCart)

// Add DOM element to cart body.
const loadProds = (cart, cartBodyEl) => {
    cartBodyEl.innerHTML = cart.items.length ? 
        '' :
        emptyCartEl.outerHTML
    cart.items.forEach((product) => {
        const cartElement = createCartElement(product, cartBodyEl);
        try {
            const input = cartElement.querySelector('input');
            input.value = product.quantity;
        } catch (err) {
        }
        cartBodyEl.appendChild(cartElement);
    })
}

// Event listener to buttons on product section
const addCartEl = (item, ev) => {
    //Add item to Cart after click add to cart button
    if (ev.target.matches('#addToCart')) {
        const quantityEl = createInputElement();
        cart.addToCart(item);
        ev.target.parentElement.prepend(quantityEl);
        ev.target.remove();
}}
const addWishEl = (item, ev) => {
    // Add item to wish list after click heart icon.
    if (ev.target.matches('.fa-heart')) {
        let status = ev.target.dataset.status
        status == 0 ?
        wish.addToCart(item) :
        wish.removeFromCart(item);
        updateWishButton(item.id);
    }
}


// Event listener to navbar links - opens cart or wish window and load product elements
const navLinks = document.querySelectorAll('.navbar-link');
navLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', openCart)
})

cartLink.addEventListener('click', () => {
    loadProds(cart, cartBodyEl);
    loadProds(wish, wishBodyEl);
    showCartBody(switchCartBtn);
});
wishLink.addEventListener('click', () => {
    loadProds(cart, cartBodyEl);
    loadProds(wish, wishBodyEl);
    showCartBody(switchWishBtn);
});

// Event listener to switch buttons on the top of cart window
switchCartBtn.addEventListener('click', () => showCartBody(switchCartBtn))
switchWishBtn.addEventListener('click', () => showCartBody(switchWishBtn))

const cartQuantity = document.querySelector('#cartQuantity');
const wishQuantity = document.querySelector('#wishQuantity');

// Updates cart header item quantities
const updateCartHeader = () => {
    cartQuantity.textContent = cart.itemsInCart;
    wishQuantity.textContent = wish.itemsInCart;
}

// Update product 'Add to Cart and Add wish' buttons when delete or decrease quantity of item
const updateProdButton = (id) => {
    const prod = document.querySelector(`[data-id="${id}"]`);
    const prodQuantityEl = prod.querySelector('.product-quantity');
    const prodQuantityInput = prodQuantityEl.querySelector('.product-quantity-inp')
    const button = createButtonElement();
    if(cart.isExist(id)) {
        prodQuantityInput.value = cart.getItem(id).quantity;
    } else {
        prodQuantityEl.parentElement.prepend(button);
        prodQuantityEl.remove();
    }
}

const updateWishButton = (id) => {
    const prod = document.querySelector(`[data-id="${id}"]`);
    const wishButton = prod.querySelector('#addToWish');
    let status = wishButton.dataset.status;
    wishButton.dataset.status = status === '0' ? 1 : 0
    wishButton.classList.toggle('far');
    wishButton.classList.toggle('fa')
}

const emptyCartEl = document.querySelector('.empty-wishlist');
// Update cart after change product inputs.
const updateQuantityByInput = (id, ev) => {
    const item = cart.getItem(id);
    if(ev.target.closest('#increase')) {
        cart.addToCart(item);
        updateProdButton(id);
    } else if(ev.target.closest('#decrease')) {
        if(item.quantity == 1) {
            cart.removeFromCart(item);
            !cart.items.length && cartBodyEl.append(emptyCartEl.cloneNode(true));
        } else {
            cart.decreaseItemQuantity(item);
        }
        updateProdButton(id);
    }
}

// Show cart or wish body DOM when click switch buttons at the top of the cart window
const showCartBody = (switchBtnEl) => {
    // Checks which switch button is active on cart window then show active window
    !switchBtnEl.classList.contains('is-active') &&
    switchBtnEl.classList.add('is-active');
    if (switchBtnEl.id === 'cartBtn') {
        switchWishBtn.classList.remove('is-active');
        cartBodyEl.classList.add('is-visible');
        wishBodyEl.classList.remove('is-visible');
        totalPrice.textContent = cart.totalPrice;
    } else if (switchBtnEl.id === 'wishBtn') {
        switchCartBtn.classList.remove('is-active');
        wishBodyEl.classList.add('is-visible')
        cartBodyEl.classList.remove('is-visible');
        totalPrice.textContent = wish.totalPrice;
    }
    updateCartHeader();
}

// Delete item on cart - (event listener to delete button on cart window)
cartBodyEl.addEventListener('click', (ev) => {
    try {
        var prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
    } catch {
        return
    }
    if (ev.target.matches('.product-quantity-btn')) {
        const cartQuantityEl = ev.target.closest('.product-quantity');
        const cartQuantityInput = cartQuantityEl.querySelector('input');
        updateQuantityByInput(prodId, ev);
        totalPrice.textContent = cart.totalPrice;
        cartQuantityInput.value = cart.getItem(prodId) ? cart.getItem(prodId).quantity : 0
        cartQuantityInput.value === '0' &&
        ev.target.closest('.cart-item').remove();
    } else if (ev.target.matches('#deleteItem')) {
        const item = cart.getItem(prodId);
        cart.removeFromCart(item);
        totalPrice.textContent = cart.totalPrice;
        updateProdButton(prodId);
        !cart.items.length && cartBodyEl.appendChild(emptyCartEl.cloneNode(true));
        ev.target.closest('.cart-item').remove();
    }
    updateCartHeader();
})

wishBodyEl.addEventListener('click', (ev) => {
    if(ev.target.matches('.delete-btn')) {
        var prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
        const item = wish.getItem(prodId);
        wish.removeFromCart(item);
        totalPrice.textContent = wish.totalPrice;
        updateWishButton(prodId);
        ev.target.closest('.cart-item').remove();
        !wish.items.length && wishBodyEl.appendChild(emptyCartEl.cloneNode(true));
        updateCartHeader();
}})

const products = document.querySelector('.product-wrapper');

//Event listener to all products section
products.addEventListener('click', (ev) => {
    try {
        var prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
    } catch {
        return
    }
    getItem(prodId).then((item) => {
        //Event listener to inputs which is visible after the product was added to the cart.
        addCartEl(item, ev);
        addWishEl(item, ev);
        if(ev.target.matches('.product-quantity-btn')) {
            updateQuantityByInput(prodId,ev);
        }
    })
})