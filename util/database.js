const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'omkar', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
