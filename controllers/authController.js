const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransporter = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { now } = require('sequelize/types/lib/utils');


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
    if(msg.length > 0){
        msg = msg[0];
    }else{
        msg = null
    }

    console.log(req.session.isLoggedIn);
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login',
        errorMsg: msg
    })
  
}

//--> Login
//--> POST/login
//--> private
exports.postLogin = (req,res,next) =>{
    const {email,pw} = req.body;
    User.findOne({email:email})
        .then(user=>{
            if (!user){ //if user doesn't exist (by email)-> return to signup page
                req.flash('error', 'Invalid email/password');
                return res.redirect('/login');
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
                }
                return res.redirect('/login');  //if passwords don't match-> return back to login
            });
            
        })
        .catch(err=>console.log(err));
  
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
    if(msg.length > 0){
        msg = msg[0];
    }else{
        msg = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMsg: msg
    })
}

//--> Sign-up
//--> POST/signup
//--> public
exports.postSignup = (req,res,next)=>{
    const {email, pw, cpw} = req.body;
    //check if the user exists, by email
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){ //if exists-> redirect to
            req.flash('error','email exists already!') 
            return res.redirect('/signup');
        }
        return bcrypt.hash(pw, 12)
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
        .catch(err=> console.log(err));  
    })
    .catch(err=>console.log(err));
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
            .catch(err=>console.log(err));
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
        .catch(err=>console.log(err));
    
}

//--> Update Password Action
//--> POST/update-password
//--> private
exports.postUpdatePassword = (req,res,next)=>{
    const newPw = req.body.password,
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
        .then(result=> res.redirect('/login'))
        .catch(err=>console.log(err))

}