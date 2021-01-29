const Product = require('../models/Product.js');
const Order = require('../models/Order');

//--> Fetch All Products
//--> GET/shop/products
//--> public
exports.getProducts = (req,res,next)=>{
    Product.find()
    .then(products=>{
        console.log(products);
        res.render('shop/products-list',{
            products : products,
            pageTitle:'All Products',
            path:'/products-list',
            isAuthenticated: req.session.isLoggedIn
        });
    }).catch(err=>console.log(err));
}

//--> Fetch Single Product Details
//--> GET/shop/products/:pid
//--> public
exports.getProduct = (req,res,next)=>{
    const productID = req.params.pid;

    Product.findById(productID).then(product=>{
            res.render('shop/product-details',{
                product: product,
                pageTitle: product.title,
                path:'/products',
                isAuthenticated: req.session.isLoggedIn
                })
        }).catch(err=>console.log(err));
}


//--> Fetch All Products for Homepage
//--> GET/shop
//--> public
exports.getIndex = (req,res,next)=>{
    Product.find()
        .then(products=>{
            res.render('shop/index',{
                products : products,
                pageTitle:'Shop',
                path:'/',
                isAuthenticated: req.session.isLoggedIn
        });
    }).catch(err=>console.log(err));
   
}


//--> Fetch Cart Items
//--> GET/shop/cart
//--> private
exports.getCart = (req,res,next) =>{
    req.session.user.populate('cart.items.productID').execPopulate()
    .then(user=>{
        const products = user.cart.items;
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products,
            isAuthenticated: req.session.isLoggedIn
        })
    }).catch(err=>console.log(err))
    
}


//--> Add Cart Items
//--> POST/shop/cart
//--> private
exports.postCart = (req,res,next) =>{
    const productID = req.body.productID;
    Product.findById(productID)
        .then( product=>{
            return req.session.user.addToCart(product)
        }).then(result=>{
            console.log(result)
            res.redirect('/cart')
        }).catch(err=>console.log(err))
}


//--> Delete Items from Cart
//--> POST/shop/cart
//--> private
exports.postDeleteFromCart = (req,res,next) =>{
    const productID = req.body.productID;
    req.session.user.removeFromCart(productID)
    .then( result=> res.redirect('/cart'))
    .catch(err => console.log(err));
};

//--> Get Order Details
//--> GET/shop/orders
//--> private
exports.getOrders = (req,res,next) =>{
    Order.find({ 'user.userId': req.session.user._id})
    .then(orders=>{
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'Your Orders',
            orders:orders,
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err=> console.log(err))
   
}


//--> Create Order
//--> GET/shop/create-order
//--> private
exports.postOrder = (req, res, next) =>{
    req.session.user.populate('cart.items.productID')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items.map(item=>{
            return {product: {...item.productID._doc} , quantity: item.qty}
        });
        const order = new Order({
            user: {
                name: req.session.user.name,
                userId: req.session.user
            },
            products: products
        });
        return order.save();
    })
    .then(result=> {
        return req.session.user.clearCart();
    })
    .then(()=> res.redirect('/orders'))
    .catch(err=>console.log(err))
}


//--> Proceed To Checkout
//--> GET/shop/checkout
//--> private
exports.getCheckout = (req,res,next) =>{
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout',
        isAuthenticated: req.session.isLoggedIn
    })
}