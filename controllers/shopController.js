const Product = require('../models/Product.js');
const Order = require('../models/Order');


//--> Fetch All Products for Homepage
//--> GET/shop
//--> public
exports.getIndex = (req,res,next)=>{
    Product.find()
        .then(products=>{
            res.render('shop/index',{
                products : products,
                pageTitle:'Shop',
                path:'/'
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
   
}


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
            path:'/products-list'
        });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
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
                path:'/products'
                })
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })}



//--> Fetch Cart Items
//--> GET/shop/cart
//--> private
exports.getCart = (req,res,next) =>{
    req.user.populate('cart.items.productID').execPopulate()
    .then(user=>{
        const products = user.cart.items;
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
    
}


//--> Add Cart Items
//--> POST/shop/cart
//--> private
exports.postCart = (req,res,next) =>{
    const productID = req.body.productID;
    Product.findById(productID)
        .then( product=>{
            return req.user.addToCart(product)
        }).then(result=>{
            console.log(result)
            res.redirect('/cart')
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}



//--> Delete Items from Cart
//--> POST/shop/cart
//--> private
exports.postDeleteFromCart = (req,res,next) =>{
    const productID = req.body.productID;
    req.user.removeFromCart(productID)
    .then( result=> res.redirect('/cart'))
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};



//--> Get Order Details
//--> GET/shop/orders
//--> private
exports.getOrders = (req,res,next) =>{
    Order.find({ 'user.userId': req.user._id})
    .then(orders=>{
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'Your Orders',
            orders:orders
        })
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
   
}



//--> Create Order
//--> GET/shop/create-order
//--> private
exports.postOrder = (req, res, next) =>{
    req.user.populate('cart.items.productID')
    .execPopulate()
    .then(user=>{
        const products = user.cart.items.map(item=>{
            return {product: {...item.productID._doc} , quantity: item.qty}
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
        });
        return order.save();
    })
    .then(result=> {
        return req.user.clearCart();
    })
    .then(()=> res.redirect('/orders'))
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}



//--> Proceed To Checkout
//--> GET/shop/checkout
//--> private
exports.getCheckout = (req,res,next) =>{
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}