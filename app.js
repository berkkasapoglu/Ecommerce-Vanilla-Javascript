const express = require('express');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const Product = require('./models/product')
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
    const products = await Product.find({});
    const categories = await Product.distinct('category',)
    res.render('index.ejs', { products, categories });
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('product.ejs', { product });
})

// app.get('/c/', (req, res) => {
// })

// app.get('/search', (req, res) => {
//     const { q } = req.query;
//     const searchedProduct = products.find(product => product.title === q.split('-').join(' '));
//     const allCategories = products.map(product => product.category);
//     const uniqueCategories = allCategories.filter((product, idx, arr) => arr.indexOf(product) === idx);
//     res.render('index.ejs', { products: [searchedProduct], categories: uniqueCategories })
// })

app.get('/data/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);
    res.json(product);
})

app.get('/api/', async (req, res) => {
    const { price, category } = req.query
    const filteredData = await Product.aggregate([{
        $match:
        {
            price: {$gte:200, $lte:500},
            category: { $in: ['Featured','Trending']}
        }
    }]).exec()
    console.log(filteredData)


})




app.listen(3000);