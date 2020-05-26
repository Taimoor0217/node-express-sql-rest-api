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
        res.status(400).json({
            message: "Something went wrong in fetching the course from the database"
        })
        console.log(err)
    })
});

router.get('/:id', function(req, res){
    Course
    .findAll({
        where: {
            id: req.params.id
        },
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
        if (data.length){
            res.status(200).json({
                courses: data
            })
        }else{
            res.status(400).json({
                message: "The requested course could not be found."
            })
        }
    })
    .catch(err=>{
        res.status(400).json({
            message: "Something went wrong in fetching the course from the database"
        })
        console.log(err)
    })
});

module.exports = router;