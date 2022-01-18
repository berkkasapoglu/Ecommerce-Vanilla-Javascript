const express = require('express');
const app = express();

const data = require('./product.json')
const products = data.products;

app.use(express.static("public"));

app.get('/', (req, res) => {
    const categories = products.map(product => product.category);
    const uniqueCategories = categories.filter((product, idx, arr) => arr.indexOf(product) === idx);
    res.render('index.ejs', { products, categories:uniqueCategories });
})

app.get('/data/:id', (req, res) => {
    const item = products.filter(product => product.id === parseInt(req.params.id))[0]
    res.json(item);
})

app.listen(3000);