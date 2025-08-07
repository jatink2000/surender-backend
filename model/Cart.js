const { default: mongoose } = require("mongoose");

const Addcartschema = new mongoose.Schema({
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
    metaDescription: String,
    quantity:{
        type:Number,
        default: 1, 
        min:1
    }
});

module.exports = mongoose.model("cartitems", Addcartschema)
