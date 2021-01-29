const User = require('../models/User');

//--> Login
//--> GET/login
//--> public
exports.Login = (req,res,next) =>{
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1] === 'true';
    console.log(req.session.isLoggedIn);
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated:false
    })
  
}

//--> Login
//--> POST/login
//--> private
exports.postLogin = (req,res,next) =>{
    req.session.isLoggedIn = true;
    User.findById('5ff9bba1eeeca520a8ae4585')
        .then(user=>{
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err=>console.log(err));
  
}