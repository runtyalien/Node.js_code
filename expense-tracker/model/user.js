const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define(
    "userexpenses",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isPremiumUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      total: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
module.exports = User;