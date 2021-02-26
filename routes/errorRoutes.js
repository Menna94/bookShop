const express = require('express'),
router = express.Router();

const {get404, get500} = require('../controllers/errorController');

router.get('/404', get404);
router.get('/500', get500);

module.exports = router;