const express = require('express');
const engine = require('ejs-mate');
const app = express();

const data = require('./product.json')
const products = data.products;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.get('/', (req, res) => {
    const allCategories = products.map(product => product.category);
    const uniqueCategories = allCategories.filter((product, idx, arr) => arr.indexOf(product) === idx);
    res.render('index.ejs', { products, categories: uniqueCategories });
})

app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(product => product.id === parseInt(id));
    res.render('product.ejs', { product });
})

app.get('/search', (req, res) => {
    const { q } = req.query;
    const searchedProduct = products.find(product => product.title === q.split('-').join(' '));
    console.log([searchedProduct]);
    const allCategories = products.map(product => product.category);
    const uniqueCategories = allCategories.filter((product, idx, arr) => arr.indexOf(product) === idx);
    res.render('index.ejs', { products: [searchedProduct], categories: uniqueCategories })
})

app.get('/data/:id', (req, res) => {
    const item = products.filter(product => product.id === parseInt(req.params.id))[0]
    res.json(item);
})

app.get('/api/', async (req, res) => {
    if(Object.keys(req.query).length) {
        const filteredData = await filterByQuery(req,res);
        res.json(filteredData);
    }
    else res.json(products);
})

const filterByQuery = async (req, res) => {
    const { category, price } = req.query
    const categories = category ? category.split(',') : 'All';
    let [minPrice, maxPrice] = price ? price.split('-') : ['*', '*'];
    const filteredProducts = await products.filter(product => {
        return ((categories === 'All' ?
        true:
        categories.indexOf(product.category) >= 0) 
        && 
        (minPrice === '*' ?
        true :
        product.price > minPrice) 
        &&
        (maxPrice === '*' ?
        true :
        product.price < maxPrice)
        )
    })
    return filteredProducts
}


app.listen(3000);