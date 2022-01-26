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
const pageFilter = new Filter('p')

filterItemEls.forEach(filter => {
    filter.addEventListener('click', (ev) => {
        categoryFilter.updateQuery(ev.target.value);
        let updatedUrl = categoryFilter.getQueryString(',')
        updatedUrl = clearPagination(updatedUrl);
        window.history.pushState({}, '',updatedUrl)
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
        minUpdateUrl = clearPagination(minUpdateUrl);
        window.history.pushState({}, '',minUpdateUrl)
    }
    if(maxPrice.value !== '') {
        maxPriceFilter.reset();
        maxPriceFilter.updateQuery(maxPrice.value)
        maxUpdateUrl = maxPriceFilter.getQueryString(',')
        maxUpdateUrl = clearPagination(maxUpdateUrl);
        window.history.pushState({}, '',maxUpdateUrl)   
    }
    displayFilteredCategory();
})

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
    pageFilter.reset();
    window.history.pushState({}, '','/');
    displayFilteredCategory();
})

const loadProdEl = document.querySelector('.load-more')
pageFilter.next = 2;
loadProdEl.addEventListener('click', async () => {
    pageFilter.reset();
    pageFilter.updateQuery(`${pageFilter.next}`);
    const updatedUrl = pageFilter.getQueryString(',');
    if(pageFilter.next) {
        window.history.pushState({}, '',updatedUrl);
        loadMoreProduct();
    }
})

//Display created html element on product section
const displayFilteredCategory = async () => {
    const filteredEl = await createHtmlElement();
    productsEl.innerHTML = filteredEl.join('');
}

const loadMoreProduct = async () => {
    if(pageFilter.next) {
        const filteredEl = await createHtmlElement();
        productsEl.insertAdjacentHTML('beforeend', filteredEl.join(''));
    }
}

//Removes page query string in url
const clearPagination = (query) => {
    pageFilter.reset();
    const re = /&?p=\d+&?/
    return query.replace(re, '');
}

//Get data from database with query string and create html element
const createHtmlElement = async () => {
    const path = window.location.pathname;
    const url = window.location.href
    const filterUrl = path === '/c/' ? url.replace('/c/', '/api/') : url + 'api';
    const res = await fetch(filterUrl);
    const filteredData = await res.json();
    pageFilter.next = filteredData.next
    const filteredEl = await filteredData.results.map((product) => {
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
    return filteredEl;
    }
