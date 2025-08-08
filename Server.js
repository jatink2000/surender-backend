express = require("express")



app = express()



app.listen(8080, () => {
    console.log("server start------")
})
// app.set('view engine', 'ejs')



const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())


// schema----------------------------
const User = require("./model/Users")
const Productschema = require("./model/Productmodel")
const Cartschema = require("./model/Cart")
const Wishlistschema = require("./model/Wishlist")

const { mongoose } = require("mongoose")
// const Users = require("./model/Users")
mongoose.connect("mongodb+srv://ravi:lK9TyIyGQeFhSTkk@jatink8059.quqwq.mongodb.net/freshcart1").then((res) => {
    console.log("mongodb connected.")
}).catch((err) => { console.log(err) })

cors = require('cors')
app.use(cors())


// async function sachin() {
//     let b = await a.connect()
//     let c = await b.db("nodejs")
//     let d = await c.collection("taskdata")
//     let result = await d.find({}).toArray()
//     // console.log(result)
// }
// sachin()

// app.get('/',  (req, res)=>{
//     res.send('hello home')
// })



// to login -------------------------------------------------------------
app.post('/signin', async (req, res) => {
    let a = req.body.loginformdata

    let existinguser = await User.findOne({ email: a.email })

    if (existinguser && existinguser.password === a.password) {
        res.json({
            status: true,
            msg: "login succusfully"
        })
    } else {
        res.json({
            status: false,
            msg: "invalid user"
        })
    }



})


// to get data from signup form and save it in database--------------------------------
app.post('/signup', async (req, res) => {
    let a = req.body.formdata

    let userdata = await User.insertOne({
        firstname: a.firstname,
        lastname: a.lastname,
        email: a.email,
        password: a.password
    })

    let result = await userdata.save();
    if (result) {
        res.json({
            status: true,
            msg: 'signup succusfully'
        })
    } else {
        res.json({
            status: false,
            msg: "sign failed"
        })
    }


    // to forgot password----------------------------------------------------------------
    app.post('/forgotpassword', async (req, res) => {
        let a = req.body;

        let forgotuser = await User.findOneAndUpdate({ email: a.email }, { $set: { password: a.password } })
        console.log(forgotuser)
    })
})



// to send the data from database to frontend---------------------------------------
app.get('/allusers', async (req, res) => {
    let allusers = await User.find({})
    console.log(allusers)
    if (allusers) {
        res.json({
            status: true,
            ouruser: allusers
        })
    } else {
        res.json({
            status: false
        })
    }
})


app.get('/allproducts', async (req, res) => {
    let allproducts = await Productschema.find({})
    // console.log(allproducts)
    if (allproducts) {
        res.json({
            status: true,
            ouruser: allproducts
        })
    } else {
        res.json({
            status: false
        })
    }
})


app.get('/Home', (req, res) => {
    res.render('Home')
})


app.get('/delete', (req, res) => {
    res.render('Delete');
});




app.post('/addproducts', async (req, res) => {
    let a = req.body

    let productdata = await Productschema.insertOne({
        name: a.name,
        category: a.category,
        weight: a.weight,
        unit: a.unit,
        image: a.image,
        description: a.description,
        code: a.code,
        sku: a.sku,
        inStock: a.inStock,
        status: a.status,
        salePrice: a.salePrice,
        regularPrice: a.regularPrice,
        metaTitle: a.metaTitle,
        metaDescription: a.metaDescription
    })

    let result = await productdata.save();
    if (result) {
        res.json({
            status: true,
            msg: 'product added succusfully'
        })
    } else {
        res.json({
            status: false,
            msg: "failed to add the product"
        })
    }
})


// addtocart---------------------
app.post("/addtocart", async (req, res) => {
    // console.log(req.body)

    let a = req.body


    let productdata = await Cartschema.insertOne({
        name: a.name,
        category: a.category,
        weight: a.weight,
        unit: a.unit,
        image: a.image,
        description: a.description,
        code: a.code,
        sku: a.sku,
        inStock: a.inStock,
        status: a.status,
        salePrice: a.salePrice,
        regularPrice: a.regularPrice,
        metaTitle: a.metaTitle,
        metaDescription: a.metaDescription
    })

    let result = productdata.save();
    if (result) {
        res.json({
            status: true,
            msg: "added to cart "
        })
    } else {
        res.json({
            status: false,
            msg: "failed to add cart"
        })
    }
})


app.get('/allcartdata', async (req, res) => {
    let allcartdata = await Cartschema.find({})
    // console.log(allcartdata)

    if (allcartdata) {
        res.json({
            status: true,
            cartdata: allcartdata,

        })
    } else {
        res.json({
            status: false
        })
    }
})


app.post('/deleteapi', async (req, res) => {
    let a = req.body;
    const deleteproduct = await Cartschema.findOneAndDelete(a._id)
    if (deleteproduct) {
        res.json({
            status: true,
            msg: "cart product deleted"
        })
    } else {
        res.json({
            status: false,
            msg: "failed to delete"
        })

    }

})


app.patch('/cart/:id/quantity', async (req, res) => {
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
        res.json({
            status: false,
            msg: "Quantity must be at least 1"
        })
    }

    try {
        const updateItem = await Cartschema.findByIdAndUpdate(
            req.params.id,
            { quantity },
            { new: true }
        )
        if (!updateItem) {
            res.json({
                status: false,
                msg: 'item not found'
            })
        }
        res.json({
            status: true,
            msg: 'quantity udpdated',
            updateItem
        })
    } catch (err) {
        res.json({
            status: false,
            msg: "Server error",
            err: err.message
        })
    }
})




app.post('/wishlist', (req, res) => {
    let a = req.body
    // console.log(a)

    let wishlistdata = Wishlistschema.insertOne({
        name: a.name,
        category: a.category,
        weight: a.weight,
        unit: a.unit,
        image: a.image,
        description: a.description,
        code: a.code,
        sku: a.sku,
        inStock: a.inStock,
        status: a.status,
        salePrice: a.salePrice,
        regularPrice: a.regularPrice,
        metaTitle: a.metaTitle,
        metaDescription: a.metaDescription
    })

    let result = wishlistdata.save();

    if (result) {
        res.json({
            status: true,
            msg: 'added to wishlist'
        })
    } else (
        res.json({
            status: false,
            msg: 'failed to wishlist'
        })
    )
})

app.get('/allwishlistdata', async (req, res) => {
    let allwishlistdata = await Wishlistschema.find({});

    if (allwishlistdata) {
        res.json({
            status: true,
            cartdata: allwishlistdata
        })
    } else {
        res.json({
            status: false,

        })
    }
})


app.delete('/wishlist/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Wishlistschema.findByIdAndDelete(id);
        if (deleted) {
            res.json({
                status: true,
                msg: 'product deleted from wishlist'
            })
        } else {
            res.json({
                status: false,
                msg: 'product delete failed '
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Server error',
            error: error.message
        });

    }
})















app.get('/', (req, res) => {
  res.send('Hello from backend');
});
