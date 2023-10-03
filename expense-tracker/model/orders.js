const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Order = sequelize.define("order", {
  orderid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId:{
    type: Sequelize.STRING,
    allowNull: false,
  }
  });

  module.exports= Order;