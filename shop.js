const express = require('express'),
app = express(),
parser = require('body-parser'),
path = require('path');

//DB
const mongoConnect = require('./util/mongodb').mongoConnect;

//Routes
const adminRoutes = require('./routes/adminRoutes.js'),
shopRoutes = require('./routes/shopRoutes.js');

//Controllers
const get404 = require('./controllers/errorController.js');

//Models
const User = require('./models/User');



//--> App Configs
app.use(parser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname , 'public')));

//--> View
app.set('view engine', 'pug');
app.set('views','views');

//--> USER
app.use((req,res,next)=>{
    User.findById('5ff148710f4f5e4eaae9e499')
        .then(user=>{
            req.user = new User(user.name, user.email, user.cart, user.id);
            next();
        })
        .catch(err=>console.log(err));
})

//--> Using Routes
app.use('/admin',adminRoutes);
app.use(shopRoutes);

//--> Error Controller
app.use(get404);





//--> MONGODB
mongoConnect(()=>{
    app.listen(8080);
})

