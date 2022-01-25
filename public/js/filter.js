export default class Filter {
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
        let re = new RegExp(`(${this.name}=)(\\w+${divider}?)+`, "g")
        if(path === '/') return `c/?${this.name}=${this.queries.join(divider)}`;
        if(query.search(re) >= 0) {
            const replaceString = `${this.name}=${this.queries.join(divider)}`;
            if(!this.queries.length && filterSize>1) {
                const filtersLast = [];
                for(let filter of filters) {
                    if(filter.search(re)<0) filtersLast.push(filter);
                }
                return filtersLast[0][0] !== '?' ? '?'+filtersLast.join('&') : filtersLast.join('&')
            }
            return !this.queries.length ? '/' : query.replace(re, replaceString);

        } else {
            return `${query}&${this.name}=${this.queries.join(divider)}`;
        }
    }

    reset() {
        this.queries.splice(0,);
    }
}