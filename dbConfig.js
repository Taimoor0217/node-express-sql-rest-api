const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './fsjstd-restapi.db'
  });
module.exports =  sequelize;