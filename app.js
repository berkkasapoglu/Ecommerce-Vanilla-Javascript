const express = require('express');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const Product = require('./models/product');
const app = express();

mongoose.connect('mongodb://localhost:27017/Ecommerce')
    .then(() => {
        console.log('Mongo Connected')
    }) 
    .catch(err => {
        console.log(err);
    })

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.get('/', async (req, res) => {
    const products = await Product.find({}).limit(10);
    const categories = await Product.distinct('category',)
    res.render('index.ejs', { products, categories });
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('product.ejs', { product });
})

app.get('/c/', async (req, res) => {
    const filteredData = await getFilteredData(req);
    const categories = await Product.distinct('category',)
    res.render('index.ejs', { products:filteredData,  categories});
})

app.get('/data/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);
    res.json(product);
})

app.get('/api/', async (req, res, next) => {
    const filteredData = await getFilteredData(req);
    res.json(filteredData);
})

const getFilteredData = async (req, res, next) => {
    let querySchema = {};
    const { category,pmin,pmax,s } = req.query
    if(category) querySchema.category = {$in: category.split(',')}
    if(pmin && pmax) querySchema.price = { $gte: parseInt(pmin), $lte: parseInt(pmax)};
    else if(pmin) querySchema.price = { $gte: parseInt(pmin)}
    else if(pmax) querySchema.price = { $lte: parseInt(pmax)}
    if(s) querySchema.title = s.split('-').join(' ');
    const filteredData = await Product.find(querySchema);
    return filteredData;
}




app.listen(3000);