const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
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

function authenticateUser(data){
    return new Promise((resolve , reject)=>{
        User
        .findAll({
            raw: true,
            where: {
                emailAddress: data.emailAddress
            }
        })
        .then(user =>{
            user = user[0]
            console.log("User :",  user)
            bcrypt
            .compare(data.password , user.password)
            .then((decision)=> {
                console.log(decision)
                decision ? resolve(user): reject(decision)
            })
            .catch((err)=>reject(false))
        })
        .catch(err=>{
            console.log(err)
            reject(false)
        })
    })
}

// Get all users
router.get('/ping', function(req, res){
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


// Return currently authenticated user
router.get('/', function(req, res){
    // console.log(auth(req))
    data = auth(req)
    User
    .findAll({
        raw: true,
        attributes: {
            exclude: ['createdAt' , 'updatedAt' , 'id']
        },
        where: {
            emailAddress: data.name            
        }
    })
    .then((user)=>{
        res.status(200).send(user[0])
    })
    // .catch(d =>console.log(d))
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

// User Login
router.post('/login' , function(req , res){
    const data = req.body
    // console.log(data)
    if(!data.emailAddress || !data.password){
        res.status(400).json({message: "email or password cannot be empty"})
        res.end()
    }else{
        authenticateUser(data)
        .then((user)=>{
            delete user.password
            res.status(200).json(user)
            res.end()
        })
        .catch(()=>{
            res.status(403).json({
                message: "Invalid credentials"
            })
        })
    }
})

module.exports = router;