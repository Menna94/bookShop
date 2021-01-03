const getDB = require('../util/mongodb').getDB;
const mongodb = require('mongodb');


class Product {
    constructor(title, imgURL, price, description, id, uid){
        this.title = title;
        this.imgURL = imgURL;
        this.price = price;
        this.description = description;
        this._id = id? new mongodb.ObjectId(id): null;
        this.uid = uid;
    }

    //Add [OR] Update a Product
    save(){
        const db = getDB();
        let dbop;
        if(this._id) //if the product exists 
        {//update the exisiting product
            dbop = db.collection('products').updateOne(
                {_id: this._id},
                { $set:  this}
            );
        } else { //if the _id is null
            //add that product as a new one
            dbop = db.collection('products').insertOne(this);
        }
        return dbop
            .then(result=>{console.log(result)})
            .catch(err=>console.log(err))
    }

    //Fetch All Products
    static fetchAll(){
        const db = getDB();
        return db.collection('products')
            .find()
            .toArray()
            .then(products=>{
                console.log(products);
                return products;
            })
            .catch(err=>console.log(err)); //for couple of hunderades of data
    }

    //Fetch Single Product
    static findById(pid){
        const db = getDB();
        return db.collection('products')
            .find({_id: new mongodb.ObjectId(pid)})
            .next()
            .then(product=>{
                console.log(product);
                return product;
            })
            .catch(err=>console.log(err)); 
    }

    //Delete a Product
    static deleteById(pid){
        const db = getDB();
        return db.collection('products')
            .deleteOne({_id:new mongodb.ObjectId(pid)})
            .then(result=>console.log('DELETED!'))
            .catch(err=>console.log(err))
    }
}

module.exports = Product;