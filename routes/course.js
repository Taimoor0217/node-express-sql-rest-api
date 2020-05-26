const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Bring in Models
let Course = require('../models/course');
let User = require('../models/user');

// List of courses
router.get('/', function(req, res){
    Course
    .findAll({
        attributes: {
            exclude: ["createdAt" , "updatedAt" , "userId" , "User.id"],
        },
        include:[{
            model: User,
            attributes: {
                exclude: ["password" , "id" , "createdAt" , "updatedAt"]
            }
        }]
    })
    .then(data=>{
        res.status(200).json({
            courses: data
        })
    })
    .catch(err=>{
        console.log(err)
    })
});

module.exports = router;