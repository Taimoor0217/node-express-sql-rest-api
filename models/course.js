const Sequelize = require('sequelize');
const db = require('../dbConfig');
const user = require('./user')
const course = db.define('Course' , {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false

    },
    estimatedTime: {
        type: Sequelize.STRING
    },    
    materialsNeeded: {
        type: Sequelize.NUMBER
    }
})
module.exports = course;