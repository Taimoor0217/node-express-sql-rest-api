const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Bring in User Model
let User = require('../models/user');

// bcrypt
// .compare("password" , hash )
// .then(r => console.log("RES: " , r ))
// .catch(err => console.log(err))

function checkAttributes(data){
    if (!data.emailAddress || !data.firstName || !data.password)
        return false
    return true;
}

function createUser(data , res){
    bcrypt
    .hash(data.password , saltRounds)
    .then( hash=>{
        data.password = hash
        User
        .create(data)
        .then(user=>{
            console.log("user created successfully")
            res.status(201).location('/')
            res.end()
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({message: "something went wrong while creating the user."})
            res.end()
        })   
    })
    .catch(err=> console.log(err))

}


// Get all users
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

// Create User
router.post('/' , function(req , res){
    // console.log(req.body)
    if (!checkAttributes(req.body)){
        res.status(400).json({message: "invalid attributes"});
    } else{
        User
        .count({
            where: { emailAddress: req.body.emailAddress }
        })
        .then(count=>{
            if (count){
                res.status(403).json({message: "Email address in use!"});
                res.end()
            } else{
                //if emailAdress is not in use, create user.
                createUser(req.body , res)
            }
                
        })
        .catch(err=>{
            console.log(err)
            res.status(500)
        })
    }
        
})

module.exports = router;