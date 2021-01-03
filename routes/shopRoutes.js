const express = require('express');
const {
    getIndex, getProducts, getProduct,
    getCart, postCart, postDeleteFromCart,
    getOrders, getCheckout
} = require('../controllers/shopController.js'); 

const router = express.Router();

// {*/ HOMEPAGE /*}
//--> Fetch All Products for Homepage
router.get('/', getIndex);

// {*/ PRODUCTS /*}
//--> Fetch All Products
router.get('/products',getProducts);
//--> Fetch Single Product Details
router.get('/products/:pid',getProduct);

// {*/ CART /*}
//--> Fetch Cart Items
// router.get('/cart', getCart);
//--> Add Cart Items
router.post('/cart', postCart);
//--> Delete Items from Cart
// router.post('/cart', postDeleteFromCart);

// {*/ ORDER /*}
//--> Get Order Details
// router.get('/orders', getOrders );
//--> Proceed To Checkout
// router.get('/checkout',getCheckout);


module.exports= router;