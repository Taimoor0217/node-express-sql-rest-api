let User = require('../models/user');
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');

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
            // console.log("JERERERE" , user)
            if(user.length > 0){
                user = user[0]
                console.log("User :",  user)
                bcrypt
                .compare(data.password , user.password)
                .then((decision)=> {
                    console.log(decision)
                    decision ? resolve(user): reject(decision)
                })
                .catch((err)=>reject(false))
            }else{
                reject(false)
            }
        })
        .catch(err=>{
            console.log(err)
            reject(false)
        })
    })
}

function Authorize(req , res , next){
    // console.log("Autrhorized Called")
    data = auth(req)
    // console.log()
    if(typeof(data) == "undefined"){
        console.log("rejecting unatuhorized request")
        res.status(401).json({
            message: "Could not authorize the request"
        })
    }else if( !data.name | !data.pass ){
        console.log("rejecting unatuhorized request")
        res.status(401).json({
            message: "Could not authorize the request"
        })
    }else{
        authenticateUser({
            emailAddress: data.name,
            password: data.pass
        })
        .then(()=>{
            next()
        })
        .catch(()=>{
            console.log("rejecting unatuhorized request")
            res.status(401).json({
                message: "Could not authorize the request"
            })
        })
    }
}

module.exports = {
    authenticateUser,
    Authorize
}