const Product = require('../models/Product.js');
const Cart = require('../models/Cart.js');

//--> Fetch All Products
//--> GET/shop/products
//--> public
exports.getProducts = (req,res,next)=>{
    Product.fetchAll().then(products=>{
        res.render('shop/products-list',{
            products : products,
            pageTitle:'All Products',
            path:'/products-list'
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
                path:'/products-list'
                })
        }).catch(err=>console.log(err));
}


//--> Fetch All Products for Homepage
//--> GET/shop
//--> public
exports.getIndex = (req,res,next)=>{
    Product.fetchAll()
        .then(products=>{
            res.render('shop/index',{
                products : products,
                pageTitle:'Shop',
                path:'/'
        });
    }).catch(err=>console.log(err));
   
}


//--> Fetch Cart Items
//--> GET/shop/cart
//--> private
exports.getCart = (req,res,next) =>{
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = [];
            for(product of products){
                const cartProductsData = cart.products.find(prod=> prod.id === product.id);
                if(cartProductsData){
                    cartProducts.push({ productData: product, qty:cartProductsData.qty})
                }
            }
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            })
        })
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
        }).then(result=>console.log(result))
}


//--> Delete Items from Cart
//--> POST/shop/cart
//--> private
exports.postDeleteFromCart = (req,res,next) =>{
    const productID = req.body.id;
    Product.findById(productID, p=>{
        Cart.deleteProduct(productID, p.price);
        res.redirect('/');
    });
};

//--> Get Order Details
//--> GET/shop/orders
//--> private
exports.getOrders = (req,res,next) =>{
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders'
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