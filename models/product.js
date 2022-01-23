const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    category: String
})

module.exports = mongoose.model('Product', productSchema);