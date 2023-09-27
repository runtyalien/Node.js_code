const Sequelize = require('sequelize');

const sequelize = new Sequelize("usersexpense", "root", "omkar", {
    host: "localhost",
    dialect: "mysql",
  });

  module.exports = sequelize;