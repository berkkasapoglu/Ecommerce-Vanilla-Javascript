
//Checkbox DOMs
const filterItemEls = document.querySelectorAll('.filter-item');
const productsEl = document.querySelector('.products');
const filterBtn = document.querySelector('.filter-btn');
//Price DOMs
const minPrice = document.querySelector('#minPrice')
const maxPrice = document.querySelector('#maxPrice')

// const categoryFilter = document.querySelector('.category-filter');
const searchButtonEl = document.querySelector('.fa-search');
const searchInputEl = document.querySelector('.search-input');

const searchParams = new URLSearchParams();

class Filter {
    constructor(name) {
        this.name = name;
        this.queries = [];
    }

    updateQuery(queryName) {
        if(this.queries.includes(queryName)) {
            this.queries.splice(this.queries.indexOf(queryName), 1);
        } else {
            queryName.split(' ').map(queryName => this.queries.push(queryName));    
        }
    }
    getQueryString(divider) {
        const query = window.location.search;
        const path = window.location.pathname;
        let filters = query.split('&')
        let filterSize = filters.length;
        let re = new RegExp(`(\\?)(${this.name}=)(\\w+${divider}?)+`, "g")
        console.log(filters,path);
        if(path === '/') return `c/?${this.name}=${this.queries.join(divider)}`;
        if(!this.queries.length && filterSize>1) {
            const filtersLast = [];
            for(let filter of filters) {
                if(filter.search(re)<0) filtersLast.push(filter);
            }
            return '?'+filtersLast.join('&');
        }
        else if(!this.queries.length) return '/'
        else if(query.search(re) >= 0) {
            const replaceString = `?${this.name}=${this.queries.join(divider)}`;
            return query.replace(re, replaceString);
        }
        else {
            return `${query}&${this.name}=${this.queries.join(divider)}`.slice(0,);
        }
    }
}

class RangeFilter extends Filter {

    set min(value) {
        if(this._min) this.queries.splice(this.queries.indexOf(this._min),1);
        this._min = value;
        this.queries.push(this._min)
    } 

    set max(value) {
        if(this._max) this.queries.splice(this.queries.indexOf(this._max),1);
        this._max = value;
        this.queries.push(this._max)
    }


}
const categoryFilter = new Filter('category');
const priceFilter = new RangeFilter('price');

filterItemEls.forEach(filter => {
    filter.addEventListener('click', (ev) => {
        categoryFilter.updateQuery(ev.target.value);
        const updatedUrl = categoryFilter.getQueryString(',')
        window.history.pushState({}, '',updatedUrl)
    })
})

filterBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    priceFilter.min = minPrice.value !== '' ? minPrice.value : '*'
    priceFilter.max = maxPrice.value !== '' ? maxPrice.value : '*'
    const updatedUrl = priceFilter.getQueryString('-')
    window.history.pushState({}, '',updatedUrl)
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
    window.history.pushState({}, '','/');
})

// const updateUrl = (ev) => {
//     const refresh = window.location.href;
//     const title = ev.target.dataset.title;
//     const value = ev.target.value;
//     const queryValues = searchParams.get(title);
//     if(ev.target.checked) {
//         if(!searchParams.get(title)) searchParams.append(title, value);
//         else searchParams.set(title, queryValues+','+value);
//     } else {
//         const paramArr = queryValues.split(',')
//         const removedParamIndex = paramArr.indexOf(ev.target.value);
//         paramArr.splice(removedParamIndex, 1);
//         paramArr.length === 0 ? 
//         searchParams.delete(title) :
//         searchParams.set(title,paramArr.join(','));
//     }
//     const updatedUrl = searchParams.toString() ?
//     '?'+decodeURIComponent(searchParams.toString()) : 
//     '/'
//     window.history.pushState({path: refresh}, '', updatedUrl)
// }

// searchButtonEl.addEventListener('click', (ev) => {
//     ev.preventDefault();
//     const words = searchInputEl.value.split(' ');
//     console.log(words);
//     if(words.length > 1) window.location.replace(`/search?q=${words.join('-')}`);
//     else window.location.replace(`/search?q=${words[0]}`);
// })



// filterBtn.addEventListener('click', (ev) => {
//     ev.preventDefault();
//     if(minPrice.value > maxPrice.value) [minPrice.value,maxPrice.value] = [maxPrice.value,minPrice.value];
//     rangeQuery(ev, minPrice.value, maxPrice.value);
//     displayFilteredCategory();
// })



// const rangeQuery = (ev, min, max) => {
//     const refresh = window.location.href;
//     const title = ev.target.dataset.title;
//     let queryStr = `${min ? min : '*'}-${max ? max : '*'}`;
//     if(!searchParams.toString()) {
//         searchParams.append(title, queryStr);
//     } else {
//         searchParams.set(title, queryStr);
//     }
//     const updatedUrl = searchParams.toString() ?
//     '?'+decodeURIComponent(searchParams.toString()) : 
//     '/'
//     window.history.pushState({path: refresh}, '', updatedUrl)
// }

// const displayFilteredCategory = async () => {
//     const filteredEl = await createFilteredEl();
//     while(productsEl.children.length > 0) await productsEl.removeChild(productsEl.firstChild);
//     productsEl.innerHTML = filteredEl;
// }

// const createFilteredEl = async () => {
//     const filterUrl = window.location.origin + '/api/' + window.location.search;
//     const res = await fetch(filterUrl);
//     const filteredData = await res.json();
//     const filteredEl = await filteredData.map((product) => {
//         return `<div class="product scale" data-id="${product.id}">
//         <a href="/products/${ product.id }"><img src="/${ product.image }" alt="" class="product-image"></a>
//                     <a href="/products/${ product.id } %>"><h4 class="product-header">${ product.title }</h4></a>
//             <i class="fa fa-star checked"></i>
//             <i class="fa fa-star checked"></i>
//             <i class="fa fa-star checked"></i>
//             <i class="fa fa-star checked"></i>
//             <i class="far fa-star "></i>
//             <p class="product-price">
//                 ${product.price}
//             </p>
//             <div class="row align-center" id="prodQuantity">
//                 <button class="btn btn-primary" id="addToCart">Add to Cart</button>
//                 <i class="far fa-heart" id="addWish" data-status="0"></i>
//             </div>
//         </div>`
//     })
//     return filteredEl.join('');
// }



