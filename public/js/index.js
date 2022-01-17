import Cart from './cart.js'
import { createCartElement, createInputElement, createButtonElement } from './product.js'

const products = document.querySelector('.products');
const cartWindow = document.querySelector('.cart');
const totalPrice = document.querySelector('#totalPrice');

const cartLink = document.querySelector('#cartLink');
const wishLink = document.querySelector('#wishLink');
const switchCartBtn = document.querySelector('#cartBtn');
const switchWishBtn = document.querySelector('#wishBtn');

const protection = document.querySelector('.protection');
const wishBody = document.querySelector('.wish-section');
const cartBody = document.querySelector('.cart-section');

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
    cartBodyEl.textContent = '';
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

const cartQuantity = document.querySelector('#cartQuantity');
const wishQuantity = document.querySelector('#wishQuantity');

// Updates product quantity added to the cart
const updateCartHeader = () => {
    cartQuantity.textContent = cart.itemsInCart;
    wishQuantity.textContent = wish.itemsInCart;
}

// Update product 'Add to Cart and Add wish' buttons when delete or decrease quantity of item
const updateProdButton = (id) => {
    const prod = document.querySelector(`[data-id="${id}"]`);
    const prodtQuantityEl = prod.querySelector('.product-quantity');
    const prodQuantityInput = prodtQuantityEl.querySelector('.product-quantity-inp')
    const button = createButtonElement();
    if(cart.isExist(id)) {
        prodQuantityInput.value = cart.getItem(id).quantity;
    } else {
        prodtQuantityEl.parentElement.prepend(button);
        prodtQuantityEl.remove();
    }
}

const updateWishButton = (id) => {
    const prod = document.querySelector(`[data-id="${id}"]`);
    const wishButton = prod.querySelector('#addWish');
    let status = wishButton.dataset.status;
    wishButton.dataset.status = status === '0' ? 1 : 0
    wishButton.classList.toggle('far');
    wishButton.classList.toggle('fa')
}

// Update cart after change product inputs.
const updateQuantityByInput = (id) => {
    const quantityIncreaseButtons = document.querySelectorAll('.product-quantity-inc');
    const quantityDecreaseButtons = document.querySelectorAll('.product-quantity-dec');
    const item = cart.getItem(id);
    quantityIncreaseButtons.forEach(btn => {
        btn.addEventListener('click', (ev) => {
            cart.addToCart(item);
            updateProdButton(id);
    })})
    quantityDecreaseButtons.forEach(btn => {
        btn.addEventListener('click', (ev) => {
            ev.stopImmediatePropagation();
            if(item.quantity == 1) {
                cart.removeFromCart(item)
            } else {
                cart.decreaseItemQuantity(item)
            }
            updateProdButton(id);
        })
    })
}

//Event listener to buttons on product section
products.addEventListener('click', (ev) => {
    try {
        var prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
    } catch {
        return
    }
    getItem(prodId).then((item) => {
        //Add item to Cart after click add to cart button
        if (ev.target.id === 'addToCart') {
            const quantityEl = createInputElement();
            cart.addToCart(item);
            ev.target.parentElement.prepend(quantityEl);
            ev.target.remove();
            updateQuantityByInput(prodId);
        }
        //Event listener to inputs which is visible after the product was added to the cart.
        //Add item to wish list after click heart icon.
        //  else if (ev.target.nodeName === "I") {
        //     let status = ev.target.dataset.status
        //     status == 0 ?
        //     wish.addToCart(item) :
        //     wish.removeFromCart(item);
        //     updateWishButton(prodId);
        // }
    })
})


// Show cart or wish body DOM when click switch buttons at the top of the cart window
const showCartBody = (switchBtnEl) => {
    // Checks which switch button is active on cart window then show active window
    !switchBtnEl.classList.contains('is-active') &&
    switchBtnEl.classList.add('is-active');
    if (switchBtnEl.id === 'cartBtn') {
        switchWishBtn.classList.remove('is-active');
        cartBody.classList.add('is-visible');
        wishBody.classList.remove('is-visible');
        totalPrice.textContent = cart.totalPrice;
    } else if (switchBtnEl.id === 'wishBtn') {
        switchCartBtn.classList.remove('is-active');
        wishBody.classList.add('is-visible')
        cartBody.classList.remove('is-visible');
        totalPrice.textContent = wish.totalPrice;
    }
    updateCartHeader();
}

// Event listener to navbar links - opens cart or wish window and load product elements
const navLinks = document.querySelectorAll('.navbar-link');
navLinks.forEach((cartLink) => {
    cartLink.addEventListener('click', openCart)
})

cartLink.addEventListener('click', () => {
    loadProds(cart, cartBody);
    loadProds(wish, wishBody);
    showCartBody(switchCartBtn);
});
wishLink.addEventListener('click', () => {
    loadProds(wish, wishBody);
    loadProds(cart, cartBody);
    showCartBody(switchWishBtn);
});

// Event listener to switch buttons on the top of cart window
switchCartBtn.addEventListener('click', () => showCartBody(switchCartBtn))
switchWishBtn.addEventListener('click', () => showCartBody(switchWishBtn))

// Delete item on cart - (event listener to delete button on cart window)
const caryBodyEl = document.querySelectorAll('.cart-body');
caryBodyEl.forEach(cartBody => {
    cartBody.addEventListener('click', (ev) => {
        try {
            var prodId = parseInt(ev.target.closest('[data-id]').dataset.id);
        } catch {
            return
        }
        if (ev.target.closest('.product-quantity-btn')) {
            const cartQuantityEl = ev.target.closest('.product-quantity');
            const cartQuantityInput = cartQuantityEl.querySelector('input')
            cartQuantityInput.value === '0' && cartuantityEl.parentElement.remove();
            updateQuantityByInput(prodId);
            updateProdButton(prodId);
            cartQuantityInput.value = cart.getItem(prodId).quantity;
            totalPrice.textContent = cart.totalPrice;
        } else if (ev.target.id === "deleteItem") {
            if(cartBody.classList.contains('cart-section')) {
                const item = cart.getItem(prodId);
                cart.removeFromCart(item);
                totalPrice.textContent = cart.totalPrice;
                updateProdButton(prodId);   
            } else {
                const item = wish.getItem(prodId);
                wish.removeFromCart(item);
                totalPrice.textContent = wish.totalPrice;
                updateWishButton(prodId);
            }
            ev.target.parentElement.remove();
        }
        updateCartHeader();
    })
})




