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
    const categories = await Product.distinct('category')
    res.render('index.ejs', { products, categories });
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('product.ejs', { product });
})

app.get('/c/', querySchema(), paginatedResults(), async (req, res) => {
    const filteredData = res.results.results;
    const categories = await Product.distinct('category')
    res.render('index.ejs', { products:filteredData,  categories});
})

app.get('/data/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id);
    res.json(product);
})

app.get('/api/', querySchema(), paginatedResults(), (req, res) => {
    res.json(res.results);
})

function querySchema() {
    return async (req, res, next) => {
        let querySchema = {};
        const { category,pmin, pmax, s, p} = req.query;
        if(category) querySchema.category = {$in: category.split(',')}

        if(pmin && pmax) querySchema.price = { $gte: parseInt(pmin), $lte: parseInt(pmax)};
        else if(pmin) querySchema.price = { $gte: parseInt(pmin)}
        else if(pmax) querySchema.price = { $lte: parseInt(pmax)}
        
        if(s) querySchema.title = new RegExp(`${s.split('-').join(' ')}`);
        res.querySchema = querySchema;
        next()
    }
}

function paginatedResults() {
    return async (req, res, next) => {
        const page  = parseInt(req.query.p) || 1;
        const limit = 10;
        const skip = (page - 1) * limit
        results = {};

        const length = await Product.collection.countDocuments(res.querySchema);
        if( page != 0 ) {
            results.prev = page - 1;
        }
        if( length > page * limit) {
            results.next = page + 1;
        }

        try {
            results.results = await Product.find(res.querySchema).limit(limit).skip(skip);
            res.results = results;
            next();
        } catch(e) {
            res.status(500).json({ message: e.message })
        }
    }
}




app.listen(3000);