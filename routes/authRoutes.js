const express = require('express'),
router = express.Router();
const {Login, postLogin} = require('../controllers/authController');

router.get('/login', Login);
router.post('/login', postLogin);



module.exports = router;