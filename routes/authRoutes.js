const express = require('express'),
router = express.Router();
const {
    Login, postLogin, Logout,
    Signup, postSignup,
    reset, postReset,
    updatePassword,postUpdatePassword
} = require('../controllers/authController');

// {*/ LOGIN /*}
router.get('/login', Login);
router.post('/login', postLogin);
router.post('/logout', Logout);

// {*/ SIGN-UP /*}
router.get('/signup', Signup);
router.post('/signup', postSignup);

// {*/ RESET PW /*}
router.get('/reset', reset);
router.post('/reset', postReset);

// {*/ UPDATE PW /*}
router.get('/reset/:token', updatePassword);
router.post('/update-password', postUpdatePassword);




module.exports = router;