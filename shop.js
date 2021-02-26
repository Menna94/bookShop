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
const errorRoutes = require('./routes/errorRoutes');

//Models
const User = require('./models/User');

// CSRF
const csrf = require('csurf'),
csrfProtection = csrf();

//flash
const flash = require('connect-flash');

//multer



//mongoDBStore
const mongoDBStore = require('connect-mongodb-session')(session),
store = new mongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'

});



//--> View
app.set('view engine', 'pug');
app.set('views','views');



//--> App Configs
app.use(parser.urlencoded({extended:false}));


app.use(express.static(path.join(__dirname , 'public')));


app.use(session({ secret: 'my secret', resave: false, saveUninitialized:false, store: store }));

app.use(csrfProtection);

app.use(flash());


//--> User
app.use((req,res,next)=>{
    if(! req.session.user){ return next();  }

    User.findById(req.session.user._id)
    .then(user => {
        if(!user){  return next();   } //extra check to make sure there is no session for non-existing object user!
        req.user = user;
        next();
    })
    .catch(err => {  throw new Error(err);   });
})


//--> setting globals
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});



//--> global error
// app.use((error, req, res, next) => {
//     // res.status(error.httpStatusCode).render(...);
//     res.redirect('/500');
// });




//--> Using Routes
app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);



//MONGOOSE
mongoose.connect(MONGODB_URI)
.then(result=>{   
    console.log('<-------------------> D B   C O N N E C T E D ! <------------------->');
    app.listen(8080);

}).catch(err=>{
    console.log(err)
    throw '---> E R O R R <-- N O  D B  F O U N D !';
})


