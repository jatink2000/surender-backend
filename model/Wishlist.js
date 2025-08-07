const { default: mongoose } = require("mongoose");

const Wishlist = new mongoose.Schema({
    name: String,
    category: String,
    weight:String,
    unit : String,
    image:String,
    description: String,
    code : String,
    sku : String,
    inStock: String,
    status: String,
    salePrice: String,
    regularPrice: String,
    metaTitle: String,
    metaDescription: String
});

module.exports = mongoose.model("Wishlist", Wishlist)
