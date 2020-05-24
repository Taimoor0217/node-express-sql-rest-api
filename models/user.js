const Sequelize = require('sequelize');
const db = require('../dbConfig');
const course = require('./course');

const user = db.define('User' , {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
    },
    emailAddress: {
        type: Sequelize.STRING
    },    
    password: {
        type: Sequelize.NUMBER
    }
})
user.hasMany(course , {
    foreignKey: 'userId'
})
course.belongsTo(user);
module.exports = user;