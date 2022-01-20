//Checkbox DOMs
const filterItemEls = document.querySelectorAll('.filter-item');
const productsEl = document.querySelector('.products');
const filterBtn = document.querySelector('.filter-btn');
//Price DOMs
const minPrice = document.querySelector('#minPrice')
const maxPrice = document.querySelector('#maxPrice')

const categoryFilter = document.querySelector('.category-filter');
filterItemEls.forEach(filter => {
    filter.addEventListener('click', (ev) => {
        updateUrl(ev);
    })
})

filterBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    if(minPrice.value > maxPrice.value) [minPrice.value,maxPrice.value] = [maxPrice.value,minPrice.value];
    rangeQuery(ev, minPrice.value, maxPrice.value);
})

const searchParams = new URLSearchParams();
const updateUrl = (ev) => {
    const refresh = window.location.href;
    const title = ev.target.dataset.title;
    const value = ev.target.value;
    const queryValues = searchParams.get(title);
    if(ev.target.checked) {
        if(!searchParams.get(title)) searchParams.append(title, value);
        else searchParams.set(title, queryValues+','+value);
    } else {
        const paramArr = queryValues.split(',')
        const removedParamIndex = paramArr.indexOf(ev.target.value);
        paramArr.splice(removedParamIndex, 1);
        paramArr.length === 0 ? 
        searchParams.delete(title) :
        searchParams.set(title,paramArr.join(','));
    }
    const updatedUrl = searchParams.toString() ?
    '?'+decodeURIComponent(searchParams.toString()) : 
    '/'
    window.history.pushState({path: refresh}, '', updatedUrl)
}
minPrice.addEventListener('input', (ev) => {
    if(minPrice.value || maxPrice.value) filterBtn.classList.remove('disabled');
    else filterBtn.classList.add('disabled');
})

maxPrice.addEventListener('input', (ev) => {
    if(minPrice.value || maxPrice.value) filterBtn.classList.remove('disabled');
    else filterBtn.classList.add('disabled');
})


const rangeQuery = (ev, min, max) => {
    const refresh = window.location.href;
    const title = ev.target.dataset.title;
    let queryStr = `${min ? min : '*'}-${max ? max : '*'}`;
    if(!searchParams.toString()) {
        searchParams.append(title, queryStr);
    } else {
        searchParams.set(title, queryStr);
    }
    const updatedUrl = searchParams.toString() ?
    '?'+decodeURIComponent(searchParams.toString()) : 
    '/'
    window.history.pushState({path: refresh}, '', updatedUrl)
}

const displayFilteredCategory = async (categories, priceFilters) => {
    const filteredEl = await createFilteredEl(categories, priceFilters);
    while(productsEl.children.length > 0) await productsEl.removeChild(productsEl.firstChild);
    productsEl.innerHTML = filteredEl;
}

const createFilteredEl = async (categories, priceFilters) => {
    const filterUrl = `/c/api/?categories=${categories.join(',')}&price=${priceFilters[0]}+${priceFilters[1]}`
    const res = await fetch(filterUrl);
    const filteredData = await res.json();
    const filteredEl = filteredData.map((product) => {
        return `<div class="product scale" data-id="${product.id}">
            <img src="${product.image}" alt="" class="product-image">
            <h4 class="product-header">
                ${product.title}
            </h4>
            <i class="fa fa-star checked"></i>
            <i class="fa fa-star checked"></i>
            <i class="fa fa-star checked"></i>
            <i class="fa fa-star checked"></i>
            <i class="far fa-star "></i>
            <p class="product-price">
                ${product.price}
            </p>
            <div class="row align-center" id="prodQuantity">
                <button class="btn btn-primary" id="addToCart">Add to Cart</button>
                <i class="far fa-heart" id="addWish" data-status="0"></i>
            </div>
        </div>`
    })
    return filteredEl.join('');
}



