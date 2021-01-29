const express = require('express'),
app = express(),
parser = require('body-parser'),
path = require('path');

//DB
const mongoose = require('mongoose'),
MONGODB_URI = 'mongodb://localhost:27017/bookShop';

//session
const session = require('express-session');

//Routes
const adminRoutes = require('./routes/adminRoutes.js'),
shopRoutes = require('./routes/shopRoutes.js'),
authRoutes = require('./routes/authRoutes');

//Controllers
const get404 = require('./controllers/errorController.js');

//Models
const User = require('./models/User');

//mongoDBStore
const mongoDBStore = require('connect-mongodb-session')(session),
store = mongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'

});

//--> App Configs
app.use(parser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized:false, store: store }));

//--> View
app.set('view engine', 'pug');
app.set('views','views');


//--> Using Routes
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


//--> Error Controller
app.use(get404);



//MONGOOSE
mongoose.connect(MONGODB_URI)
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
            const user = new User({
                name: 'Max',
                email: 'max@max.com',
                cart:{
                    items: []
                }
            });
            user.save();
        }
    })
   
    console.log('<-------------------> D B   C O N N E C T E D ! <------------------->');
    app.listen(8080);

}).catch(err=>{
    console.log(err)
    throw '---> E R O R R <-- N O  D B  F O U N D !';
})


