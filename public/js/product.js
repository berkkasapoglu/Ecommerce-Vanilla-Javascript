const createCartElement = (prod, cartBodyDOM) => {
    const container = document.createElement('div');
    container.classList.add('cart-item', 'row');
    container.setAttribute('data-id', prod.id);

    const img = document.createElement('img');
    img.src = prod.image;
    img.classList.add('cart-image')

    const hTag = document.createElement('h4')
    hTag.classList.add('cart-header')
    hTag.textContent = prod.title

    const stars = document.createElement('div');
    for(let i=0; i<4; i++) {
        const checkedStar = document.createElement('i')
        checkedStar.classList.add('fa', 'fa-star', 'checked');
        stars.appendChild(checkedStar);
    }
    const star = document.createElement('i')
    star.classList.add('far', 'fa-star');

    const priceCurrency = document.createElement('p')
    priceCurrency.className = "cart-price";
    priceCurrency.textContent = `$`
    const priceValue = document.createElement('span')
    priceValue.textContent = `${prod.price}`
    priceValue.setAttribute('id', 'priceValue')
    priceCurrency.appendChild(priceValue)

    const btn = document.createElement('button')
    btn.textContent = 'Delete'
    btn.classList.add('delete-btn')
    btn.id = 'deleteItem';

    container.appendChild(img)
    container.appendChild(hTag)
    container.appendChild(stars)
    container.appendChild(priceCurrency)
    const input = createInputElement();
    !cartBodyDOM.classList.contains('wish-section') &&
    container.appendChild(input)
    container.appendChild(btn)
    return container
}

const createInputElement = () => {
    const div = document.createElement('div')
    div.classList.add('product-quantity');

    const increaseBtn = document.createElement('button');
    const increaseIcon = document.createElement('i');
    increaseIcon.classList.add('fas', 'fa-plus', 'fa-sm');
    increaseBtn.setAttribute('id', 'increase');
    increaseBtn.classList.add('product-quantity-inc', 'product-quantity-btn');
    increaseBtn.appendChild(increaseIcon);

    const decreaseIcon = document.createElement('i');
    const decreaseBtn = document.createElement('button');
    decreaseBtn.setAttribute('id', 'decrease');
    decreaseIcon.classList.add('fas', 'fa-minus', 'fa-sm');
    decreaseBtn.classList.add('product-quantity-dec', 'product-quantity-btn');
    decreaseBtn.appendChild(decreaseIcon);

    const input = document.createElement('input');
    input.setAttribute('type','Number');
    input.setAttribute('min',0)
    input.setAttribute('value',1)
    input.classList.add('product-quantity-inp');

    div.appendChild(decreaseBtn);
    div.appendChild(input);
    div.appendChild(increaseBtn);

    return div;
}

const createButtonElement = () => {
    const button = document.createElement('button')
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('id', 'addToCart');
    button.textContent = 'Add to Cart';
    return button;
}

export { createCartElement, createInputElement, createButtonElement };