const mongoose = require('mongoose')
const Product = require('../models/product')
const fileSystem = require('fs');
const path = require('path');
const data = require('./product.json')

mongoose.connect('mongodb://localhost:27017/Ecommerce')
    .then(() => {
        console.log('Mongo Connected')
    })
    .catch(err => {
        console.log(err);
    })

const seedDb = async () => {
    Product.deleteMany({});
    Product.insertMany(data.products)
        .then(() => {
            console.log('Data inserted');
        })
        .catch(err => {
            console.log(err);
        })
}
seedDb();