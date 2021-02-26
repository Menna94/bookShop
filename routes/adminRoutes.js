const express = require('express'),
router = express.Router();
const {
    getAddProduct,getProducts,postAddProduct,
    getEditProduct,postEditProduct, deleteProduct
} = require('../controllers/adminController.js'); 
const isAuth = require('../middleware/isAuth');
const {check} = require('express-validator/check');


//--> Fetch All Products for the Admin
router.get('/products', isAuth, getProducts);


//--> Add a New Product
router.get('/add-product', isAuth, getAddProduct);
//--> Save the Added Product in DB
router.post('/add-product', [
    check('title').isString().isLength({min:3}).trim(),
    check('price').isFloat(),
    check('description').isLength({min:5, max:250}).trim()
], isAuth, postAddProduct);


//--> Edit a Product
router.get('/edit-product/:pid', isAuth, getEditProduct);
//--> Save the Updated Product to the DB
router.post('/edit-product/',
    [
        check('title').isString().isLength({min:3}).trim(),
        check('price').isFloat(),
        check('description').isLength({min:5, max:250}).trim()
    ],
    isAuth, postEditProduct);

//--> Delete a Product
router.post('/delete-product/', isAuth, deleteProduct);



module.exports= router;