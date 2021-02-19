const express = require('express');
const {
    getIndex, getProducts, getProduct,
    getCart, postCart, postDeleteFromCart,
    postOrder, getOrders, getCheckout
} = require('../controllers/shopController.js'); 
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// {*/ HOMEPAGE /*}
//--> Fetch All Products for Homepage
router.get('/', getIndex);

// {*/ PRODUCTS /*}
//--> Fetch All Products
router.get('/products', getProducts);
//--> Fetch Single Product Details
router.get('/products/:pid',getProduct);

// {*/ CART /*}
//--> Fetch Cart Items
router.get('/cart', isAuth, getCart);
//--> Add Cart Items
router.post('/cart', isAuth, postCart);
//--> Delete Items from Cart
router.post('/cart-delete-item', isAuth, postDeleteFromCart);

// {*/ ORDER /*}
//--> Post an Order
router.post('/create-order', isAuth, postOrder );
//--> Get Order Details
router.get('/orders', isAuth, getOrders );
//--> Proceed To Checkout
// router.get('/checkout',getCheckout);


module.exports= router;