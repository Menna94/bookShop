const fs = require('fs'),
path =require('path'),
rootDir = require('../util/path.js');


const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart{
    static addProduct(id,productPrice){
        //fetch the previous cart
        fs.readFile(p,(err, fileContent)=>{
            let cart = { products:[], totalPrice:0};
            if(!err){
                cart = JSON.parse(fileContent)
            } 
            //find existing products
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;
            //add new product/increase qty
            if (existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty += 1;
                cart.products = [...cart.products];
                existingProduct = updatedProduct;
            } else {
                updatedProduct = {id, qty:1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err=> console.log(err))
            
        })
        
    }
    //delete product
    static deleteProduct(id,price){
        fs.readFile(p, (err, fileContent)=>{
            if(err) return;
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(p=> p.id === id);
            if(!product) return;
            const productQty = product.qty;

            updatedCart.products = updatedCart.products.filter(p=>p.id !== id)
            updatedCart.totalPrice -= (productPrice * productQty);

            fs.writeFile(p, JSON.stringify(updatedCart), err=> console.log(err))
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
          const cart = JSON.parse(fileContent);
          if (err) {
            cb(null);
          } else {
            cb(cart);
          }
        });
      }
}

