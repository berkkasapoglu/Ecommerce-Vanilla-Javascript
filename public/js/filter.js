const filterItemEls = document.querySelectorAll('.filter-item');
const filterButtonEl = document.querySelector('.filter-btn');
const productsEl = document.querySelector('.products')
filterButtonEl.addEventListener('click', async (ev) => {
    const filters = [];
    ev.preventDefault();
    filterItemEls.forEach(filterItem => {
        if(filterItem.checked && filters.indexOf(filterItem.value) < 0) {
            filters.push(filterItem.value);
        }
    })
    const filteredDataEl = await getFilteredCategoryEl(filters);
    while(productsEl.children.length > 0) productsEl.removeChild(productsEl.firstChild);
    productsEl.innerHTML = filteredDataEl;
})

const getFilteredCategoryEl = async (categories) => {
    const res = await fetch(`/c/?categories=${categories.join(',')}`);
    const filteredData = await res.text()
    return filteredData;
}


