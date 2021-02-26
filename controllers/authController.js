const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransporter = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const {validationResult} = require('express-validator/check');


const transporter = nodemailer.createTransport(sendgridTransporter({
    auth:{
        api_key: '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'
    }
}));

//--> Login
//--> GET/login
//--> public
exports.Login = (req,res,next) =>{
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1] === 'true';
    let msg = req.flash('error');
    msg.length >0 ? msg=msg[0] : msg=null

    console.log(req.session.isLoggedIn);
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login',
        errorMsg: msg,
        oldInput:{
            email:'',
            pw:''
        },
        validationErrors: []
    })
  
}

//--> Login
//--> POST/login
//--> private
exports.postLogin = (req,res,next) =>{
    const {email,pw} = req.body;
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login',{
            path: '/login',
            pageTitle: 'Login',
            errorMsg: errors.array()[0].msg,
            oldInput:{
                email,
                pw
            },
            validationErrors: errors.array()
        })
    }
    
    User.findOne({email:email})
        .then(user=>{
            if (!user){ //if user doesn't exist (by email)
                return res.status(422).render('auth/login',{
                    path: '/login',
                    pageTitle: 'Login',
                    errorMsg: 'Invalid email/password',
                    oldInput:{
                        email,
                        pw
                    },
                    validationErrors: []
                })
            }
            bcrypt.compare(pw , user.password)
            .then(doMatch=>{
                if (doMatch){ //if passwords match-> make session with the user
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save((err)=>{
                        console.log(err);
                        res.redirect('/');
                    });
                } //if passwords don't match
                return res.status(422).render('auth/login',{
                    path: '/login',
                    pageTitle: 'Login',
                    errorMsg: 'Invalid email/password',
                    oldInput:{
                        email,
                        pw
                    },
                    validationErrors: []
                })
            });
            
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
  
}



//--> Logout
//--> POST/logout
//--> private
exports.Logout = (req,res,next) =>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    })
  
}



//--> Sign-up
//--> GET/signup
//--> public
exports.Signup = (req,res,next)=>{
    let msg = req.flash('error');
    msg.length > 0 ? msg = msg[0] : msg = null;

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMsg: msg,
        oldInput: {
            email:'', 
            pw:'', 
            cpw:''
        },
        validationErrors: []
    })
}



//--> Sign-up
//--> POST/signup
//--> public
exports.postSignup = (req,res,next)=>{
    const {email, pw} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMsg: errors.array()[0].msg,
            oldInput: {
                email, 
                pw, 
                cpw:req.body.cpw
            },
            validationErrors: errors.array()
        });
    }
    bcrypt.hash(pw, 12)
        .then(hashedPW=>{
            //else-> create new user
            const user = new User({
                email,
                password: hashedPW,
                cart: {items:[]}
            });
            return user.save();
        })
        //after signup redirect to login page
        .then(result=>{
            res.redirect('/login');
            return transporter.sendMail({
                to:email,
                from: 'urshop@bookshop.com',
                subject: 'Signed up successfully!',
                html: '<h1> You Successfully Signedup! </h1>'
            });
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })  
}



//--> Reset Password
//--> GET/reset
//--> private
exports.reset = (req,res,next)=>{
    let msg = req.flash('error');
    
    msg.length > 0 ? msg = msg[0] : msg = null;
    
    res.render('auth/resetPw', {
        path: '/reset',
        pageTitle: 'Reset Your Password',
        errorMsg: msg
    })
}



//--> Reset Password
//--> GET/reset
//--> private
exports.postReset = (req,res,next)=>{
    crypto.randomBytes(32, (err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user=>{
                if(!user){
                    req.flash('error', 'No account on that email found');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExp = Date.now() + 3600000;
                return user.save();
            })
            .then(result =>{
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'urshop@bookshop.com',
                    subject: 'Password Reset',
                    html: `
                        <p>You Requested a Password Reset</p>
                        <p>Click <a href='http://localhost:8080/reset/${token}'>here</a> to set a new password! </p>
                    `
                })
                .catch(err=>{
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                })
        })
    })
}



//--> Update Password
//--> GET/update-password
//--> private
exports.updatePassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne({resetToken : token, resetTokenExp: {$gt: Date.now()}})
        .then(user=>{
            let msg = req.flash('error');
            msg.length > 0 ? msg = msg[0] : msg = null;

            res.render('auth/updatePw',{
                path: '/update-password',
                pageTitle: 'Update Your Password',
                errorMsg: msg,
                passwordToken:token,
                userID: user._id.toString()
            })
        })
        .catch(err=>{
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    
}



//--> Update Password Action
//--> POST/update-password
//--> private
exports.postUpdatePassword = (req,res,next)=>{
    const newPw = req.body.pw,
    userID = req.body.userID,
    passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken, 
        resetTokenExp: {$gt: Date.now()},
        _id: userID
    })
        .then(user=>{
            resetUser = user;
            return bcrypt.hash(newPw, 12);
        })
        .then(hashedPw=>{
            resetUser.password = hashedPw;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExp = undefined;
            return resetUser.save();
        })
        .then(result => res.redirect('/login'))
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}