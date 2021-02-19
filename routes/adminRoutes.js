const express = require('express'),
path = require('path');
const {
    getAddProduct,getProducts,postAddProduct,
    getEditProduct,postEditProduct, deleteProduct
} = require('../controllers/adminController.js'); 
const isAuth = require('../middleware/isAuth');

const router = express.Router();

//--> Fetch All Products for the Admin
router.get('/products', isAuth, getProducts);


//--> Add a New Product
router.get('/add-product', isAuth, getAddProduct);
//--> Save the Added Product in DB
router.post('/add-product', isAuth, postAddProduct);


//--> Edit a Product
router.get('/edit-product/:pid', isAuth, getEditProduct);
//--> Save the Updated Product to the DB
router.post('/edit-product/', isAuth, postEditProduct);

//--> Delete a Product
router.post('/delete-product/', isAuth, deleteProduct);



module.exports= router;