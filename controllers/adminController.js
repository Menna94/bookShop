const Product = require('../models/Product.js');


//--> Add a New Product
//--> GET/admin/add-product
//--> private/admin
exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle: 'Add Product',
        path:'/admin/add-product'
    });
};


//--> Save the Added Product in DB
//--> GET/admin/add-product
//--> private/admin
exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imgURL = req.body.imgURL;
    const price = req.body.price;
    const description = req.body.description;
    
    const product = new Product (title, price,imgURL,description,null, req.user._id);

    product.save()
     .then(result=> {
        // console.log(result);
        console.log('CREATED PRODUCT');
        res.redirect('/admin/products');
    })
     .catch(err=>console.log(err))
}


//--> Edit a Product
//--> GET/admin/edit-product/:pid
//--> private/admin
exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    const productID = req.params.pid;

    if(!editMode) 
    {
        return res.redirect('/');
    }

    Product.findById(productID)
        .then(product=>{
            if(!product){
                return res.redirect('/');
            } 
            else {
                res.render('admin/edit-product',{
                    product: product,
                    pageTitle: 'Edit Product',
                    path:'/admin/edit-product',
                    editing: editMode
                });    
            }
        })
        .catch(err=>console.log(err));     
};


//--> Save the Updated Product to the DB
//--> POST/admin/edit-product
//--> private/admin
exports.postEditProduct = (req,res,next)=>{
    const productID = req.body.productID;
    const updatedTitle = req.body.title;
    const updatedImgURL = req.body.imgURL;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(
        updatedTitle, 
        updatedImgURL, 
        updatedPrice, 
        updatedDescription, 
        productID
    );

    updatedProduct.save()
        .then(result=>{
            console.log('ONE PRODUCT UPDATED !');
            res.redirect('/admin/products');
        })
        .catch(err=>console.log(err));
}


//--> Fetch All Products for the Admin
//--> GET/admin/products
//--> private/admin
exports.getProducts = (req,res,next)=>{
    Product.fetchAll()
        .then(products=>{
            res.render('admin/products-list',{
                products : products,
                pageTitle:'Admin Products',
                path:'/admin/products'
            });
        })
        .catch(err=>console.log(err));
}


//--> Delete a Product
//--> POST/admin/delete-product
//--> private/admin
exports.deleteProduct =(req,res,next)=>{
    const productID = req.body.productID;
    Product.deleteById(productID)
        .then(()=>{
            console.log('Deleted!');
            res.redirect('/admin/products')
        })
        .catch(err=>console.log(err));
    
}