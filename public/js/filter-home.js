import Filter from './filter.js'

//Checkbox DOMs
const filterItemEls = document.querySelectorAll('.filter-item');
const productsEl = document.querySelector('.products');
//Price DOMs
const minPrice = document.querySelector('#minPrice')
const maxPrice = document.querySelector('#maxPrice')
const filterBtn = document.querySelector('.filter-btn');

const categoryFilter = new Filter('category');
const minPriceFilter = new Filter('pmin')
const maxPriceFilter = new Filter('pmax')

filterItemEls.forEach(filter => {
    filter.addEventListener('click', (ev) => {
        categoryFilter.updateQuery(ev.target.value);
        const updatedUrl = categoryFilter.getQueryString(',')
        window.history.pushState({}, '',updatedUrl)
        createFilteredEl();
        displayFilteredCategory()
    })
})

filterBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    let minUpdateUrl;
    let maxUpdateUrl;
    if(minPrice.value !== '') {
        minPriceFilter.reset();
        minPriceFilter.updateQuery(minPrice.value)
        minUpdateUrl = minPriceFilter.getQueryString(',')
        window.history.pushState({}, '',minUpdateUrl)
    }
    if(maxPrice.value !== '') {
        maxPriceFilter.reset();
        maxPriceFilter.updateQuery(maxPrice.value)
        maxUpdateUrl = maxPriceFilter.getQueryString(',')
        window.history.pushState({}, '',maxUpdateUrl)   
    }
    createFilteredEl();
    displayFilteredCategory();
})

const displayFilteredCategory = async () => {
    const filteredEl = await createFilteredEl();
    while(productsEl.children.length > 0) await productsEl.removeChild(productsEl.firstChild);
    productsEl.innerHTML = filteredEl;
}

const createFilteredEl = async () => {
    const path = window.location.pathname;
    const url = window.location.href
    const filterUrl = path === '/c/' ? url.replace('/c/', '/api/') : url + 'api';
    const res = await fetch(filterUrl);
    const filteredData = await res.json();
    const filteredEl = await filteredData.map((product) => {
        return `<div class="product scale" data-id="${product._id}">
        <a href="/products/${ product._id }"><img src="/${ product.image }" alt="" class="product-image"></a>
                    <a href="/products/${ product.id } %>"><h4 class="product-header">${ product.title }</h4></a>
            <i class="fa fa-star checked"></i>
            <i class="fa fa-star checked"></i>
            <i class="fa fa-star checked"></i>
            <i class="fa fa-star checked"></i>
            <i class="far fa-star "></i>
            <p class="product-price">
                ${product.price}$
            </p>
            <div class="row align-center" id="prodQuantity">
                <button class="btn btn-primary" id="addToCart">Add to Cart</button>
                <i class="far fa-heart" id="addWish" data-status="0"></i>
            </div>
        </div>`
    })
    return filteredEl.join('');
}

minPrice.addEventListener('input', (ev) => {
    if(minPrice.value || maxPrice.value) filterBtn.classList.remove('disabled');
    else filterBtn.classList.add('disabled');
})

maxPrice.addEventListener('input', (ev) => {
    if(minPrice.value || maxPrice.value) filterBtn.classList.remove('disabled');
    else filterBtn.classList.add('disabled');
})
const filterResetBtnEl = document.querySelector('.filter-reset')
const filterFormEl = document.querySelector('.filter-form');
filterResetBtnEl.addEventListener('click', (ev) => {
    ev.preventDefault();
    filterFormEl.reset();
    categoryFilter.reset();
    minPriceFilter.reset();
    maxPriceFilter.reset();
    window.history.pushState({}, '','/');
    createFilteredEl();
    displayFilteredCategory()
})
