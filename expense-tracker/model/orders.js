const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Order = sequelize.define(
    "order",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
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
    },
  );

  module.exports= Order;