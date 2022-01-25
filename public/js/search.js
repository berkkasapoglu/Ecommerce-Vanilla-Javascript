import Filter from './filter.js'

const searchFilter = new Filter('s');

const searchButtonEl = document.querySelector('.fa-search');
const searchInputEl = document.querySelector('.search-input');

searchButtonEl.addEventListener('click', (ev) => {
    ev.preventDefault()
    searchFilter.reset();
    searchFilter.updateQuery(searchInputEl.value.split(' ').join('-'));
    const updatedUrl = searchFilter.getQueryString('-')
    let re = /(s=[\w-]+)(\\&)?/
    if(searchInputEl.value) window.location.href = window.location.origin + '/c/?' + updatedUrl.match(re)[1]
})

