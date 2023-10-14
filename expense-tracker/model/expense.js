const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Expense = sequelize.define("expenses", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },{
    timestamp: false,
},);

module.exports = Expense;