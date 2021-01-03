const getDB = require('../util/mongodb').getDB;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


class User {
    constructor(name,email,cart,id){
        this.name = name;
        this.email = email;
        this.cart = cart; //{items:[]}
        this._id = id;
    }

    //Add a New User
    save(){
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    //Add a Product to Cart
    addToCart(product){
        /*
            => CART DESIGN =>
            {
                productID: _id of the product loaded on the cart,
                qty: quantity of this item added,
            }
        */
        const db = getDB();

        //Detecting the Index of Every Item in the Cart
        const cartProductIdx = this.cart.items.findIndex(cartItem=>{
            return cartItem.productID == product._id
        });

        let newQty =1;
        //New Cart 
        const updatedCartItems = [...this.cart.items];

        if(cartProductIdx >= 0){ //if the cart has the same item already
            //increase the quantity
            newQty = this.cart.items[cartProductIdx].qty +1;
            updatedCartItems[cartProductIdx].qty = newQty;
        }else{ 
            //add this item as a new one in the cart
            updatedCartItems.push({productID: new ObjectId(product._id), qty:newQty})
        }

        const updatedCart = {items: updatedCartItems};

        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)},
            { $set: {cart: updatedCart}}
        );
    }

    //Fetch a User
    static findById(uid){
        const db = getDB();
        return db.collection('users')
            .findOne({_id: new ObjectId(uid)})
            .then(user=>{
                console.log(user);
                return user;
            })
            .catch(err=>console.log(err));
    }
}
module.exports = User;