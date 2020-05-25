const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Signup
router.get('/', function(req, res){
    User
    .findAll({
        raw: true,
        attributes: {
            exclude: ['password' , 'createdAt' , 'updatedAt']
        }
    })
    .then((users)=>{
        res.status(200).send(users)
    })
    .catch(d =>console.log(d))
});


module.exports = router;