const express = require('express'),
router = express.Router(),
User = require('../models/User');
const {
    Login, postLogin, Logout,
    Signup, postSignup,
    reset, postReset,
    updatePassword,postUpdatePassword
} = require('../controllers/authController');
const {check, body} = require('express-validator/check');

// {*/ LOGIN /*}
router.get('/login', Login);
router.post('/login',
[
    check('email')
        .isEmail()
        .withMessage('Naaah, a worng email.')
        .normalizeEmail(),
    check('pw', 'a password should be only charchters and numbers and at least 5 charchters long')
        .isLength({min:5})
        .isAlphanumeric()
        .trim(),

]
, postLogin);
router.post('/logout', Logout);

// {*/ SIGN-UP /*}
router.get('/signup', Signup);
router.post('/signup',
[
    check('email')
        .isEmail()
        .withMessage('Naaah, a worng email.')
        .custom((val, {req})=>{
            //check if the user exists, by email
            return User.findOne({email:val})
            .then(userDoc=>{
                if(userDoc){ //if exists-> redirect to
                    return Promise.reject('email exists already!');
                   }
            });
        }).normalizeEmail(),
    body('pw', 'a password should be only charchters and numbers and at least 5 charchters long')
        .isLength({min:5})
        .isAlphanumeric()
        .trim().withMessage('You Shouldnt leave white spaces!'),
    body('cpw')
        .custom((val, {req})=>{
            if(val !== req.body.pw){
                throw new Error('Passwords have to match!')
            }
            return true;
        })
        .trim().withMessage('You Shouldnt leave white spaces!')
], 
postSignup);

// {*/ RESET PW /*}
router.get('/reset', reset);
router.post('/reset', postReset);

// {*/ UPDATE PW /*}
router.get('/reset/:token', updatePassword);
router.post('/update-password', postUpdatePassword);




module.exports = router;