const Product = require('../models/Product.js');
const {validationResult} = require('express-validator/check');



//--> Fetch All Products for the Admin
//--> GET/admin/products
//--> private/admin
exports.getProducts = (req,res,next)=>{
    Product.find({userID: req.user._id})
        .then(products=>{
            console.log(products);
            res.render('admin/products-list',{
                products : products,
                pageTitle:'Admin Products',
                path:'/admin/products'
            });
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}



//--> Add a New Product
//--> GET/admin/add-product
//--> private/admin
exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle: 'Add Product',
        path:'/admin/add-product',
        editing:false,
        hasError:false,
        product:'',
        errorMsg: null,
        validationErrors: []
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
   


    const errors = validationResult(req);
    if(!errors.isEmpty()){ //if there's errors
        console.log(errors.array());
        return res.status(422).render('admin/edit-product',{
            pageTitle: 'Add Product',
            path:'/admin/add-product',
            editing:false,
            hasError:true,
            product:{
                title,
                imgURL,
                price,
                description
            },
            errorMsg: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    // const imgURL = img.path;
    const product = new Product ({
        title,
        imgURL,
        price,
        description,
        userID:req.user
    });

    product.save()
    .then(result=> {
        console.log('CREATED PRODUCT');
        res.redirect('/admin/products');
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}



//--> Edit a Product
//--> GET/admin/edit-product/:pid
//--> private/admin
exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit;
    const productID = req.params.pid;

    if(!editMode){   return res.redirect('/')   }

    Product.findById(productID)
        .then(product=>{
            //if the product doesn't exist-> redirect to admin products
            if(!product){   return res.redirect('/')   } 
            
            res.render('admin/edit-product',{
                product: product,
                pageTitle: 'Edit Product',
                path:'/admin/edit-product',
                editing: editMode,
                hasError:false,
                product:product,
                errorMsg: null,
                validationErrors: []
            });    
            
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatus = 500;
            return next(error);
        });     
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

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product',{
            pageTitle: 'Edit Product',
            path:'/admin/edit-product',
            editing:true,
            hasError:true,
            product:{
                title:updatedTitle,
                imgURL: updatedImgURL,
                price:updatedPrice,
                description:updatedDescription,
                _id: productID
            },
            errorMsg: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(productID).then(product=>{
        if(product.userID.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imgURL = updatedImgURL;
        

        return product.save()
            .then(result=>{
                console.log('ONE PRODUCT UPDATED !');
                res.redirect('/admin/products');
            });
    })
    .catch(err=>{
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}



//--> Delete a Product
//--> POST/admin/delete-product
//--> private/admin
exports.deleteProduct =(req,res,next)=>{
    const productID = req.body.productID;
    Product.deleteOne({_id:productID, userID:req.user._id})
        .then(()=>{
            console.log('Deleted!');
            res.redirect('/admin/products')
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    
}