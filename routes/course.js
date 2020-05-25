const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let Course = require('../models/course');

// Signup
router.get('/helo', function(req, res){
    console.log('User Registration')
});

module.exports = router;