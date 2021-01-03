const express = require('express'),
path = require('path');
const {
    getAddProduct,getProducts,postAddProduct,
    getEditProduct,postEditProduct, deleteProduct
} = require('../controllers/adminController.js'); 


const router = express.Router();

//--> Fetch All Products for the Admin
router.get('/products',getProducts);


//--> Add a New Product
router.get('/add-product',getAddProduct);
//--> Save the Added Product in DB
router.post('/add-product',postAddProduct);


//--> Edit a Product
router.get('/edit-product/:pid',getEditProduct);
//--> Save the Updated Product to the DB
router.post('/edit-product/',postEditProduct);

//--> Delete a Product
router.post('/delete-product/',deleteProduct);



module.exports= router;