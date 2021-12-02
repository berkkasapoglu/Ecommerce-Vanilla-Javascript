export const createProductElement = (prod) => {
    const container = document.createElement('div')
    container.setAttribute('data-id', prod.id)
    container.setAttribute('data-category', prod.category)

    container.classList.add('product')
    
    const img = document.createElement('img');
    img.src = prod.image;
    img.classList.add('product_image')
    
    const hTag = document.createElement('h4')
    hTag.classList.add('product_header')
    hTag.textContent = prod.title
    
    const div = document.createElement('div')
    for(let i=0; i<4; i++) {
        const checkedStar = document.createElement('i')
        checkedStar.classList.add('fa', 'fa-star', 'checked');
        div.appendChild(checkedStar);
    }
    const star = document.createElement('i')
    star.classList.add('far', 'fa-star');
    div.appendChild(star);
    
    const price = document.createElement('p')
    price.className = "product_price";
    price.textContent = `$${prod.price}`
    
    
    const btns = document.createElement('div')
    btns.classList.add('row', 'align-center')
    btns.id = 'addCartBtns';
    
    const btn = document.createElement('button')
    btn.classList.add('btn', 'btn-primary')
    btn.id = 'addCart';
    btn.setAttribute('value',0);
    btn.textContent = 'Add to Cart'
    
    const heartIcon = document.createElement('i')
    heartIcon.classList.add('far', 'fa-heart')
    heartIcon.id = 'addSaved';
    heartIcon.setAttribute('value', 0);
    
    btns.appendChild(btn)
    btns.appendChild(heartIcon)
    
    container.appendChild(img)
    container.appendChild(hTag)
    container.appendChild(div)
    container.appendChild(price)
    container.appendChild(btns)

    return container
}

export const createCartElement = (prod) => {
    const container = document.createElement('div');
    container.classList.add('cart_item', 'row');
    container.setAttribute('data-id', prod.id);

    const img = document.createElement('img');
    img.src = prod.image;
    img.classList.add('cart_image')

    const hTag = document.createElement('h4')
    hTag.classList.add('cart_header')
    hTag.textContent = prod.title

    const stars = document.createElement('div');
    for(let i=0; i<4; i++) {
        const checkedStar = document.createElement('i')
        checkedStar.classList.add('fa', 'fa-star', 'checked');
        stars.appendChild(checkedStar);
    }
    const star = document.createElement('i')
    star.classList.add('far', 'fa-star');

    const price = document.createElement('p')
    price.className = "cart_price";
    price.textContent = `$${prod.price}`
    
    const btn = document.createElement('button')
    btn.textContent = 'Delete'
    btn.classList.add('delete_btn')
    btn.id = 'deleteItem';
    
    container.appendChild(img)
    container.appendChild(hTag)
    container.appendChild(stars)
    container.appendChild(price)
    container.appendChild(btn)

    return container
}