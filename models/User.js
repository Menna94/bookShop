const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    cart:{
        items: [
            {
                productID :{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
})
userSchema.methods.addToCart  = function(product){
    const cartProductIdx = this.cart.items.findIndex(cartItem=>{
        return cartItem.productID.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartProductIdx >= 0){
        newQty = this.cart.items[cartProductIdx].qty + 1;
        updatedCartItems[cartProductIdx].qty = newQty;
    } else {
        updatedCartItems.push({
            productID: product._id,
            qty: newQty
        })
    }

    const updatedCart = {
        items : updatedCartItems
    };

    this.cart = updatedCart;
    
    return this.save();
};

userSchema.methods.removeFromCart = function(pid){
    const updatedCartItems = this.cart.itmes.filter(item =>{
        return item.productID.toString() !== pid.toString();
    });
    this.cart.itmes = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = {items: []};

    return this.save();
}
module.exports = mongoose.model('User', userSchema);