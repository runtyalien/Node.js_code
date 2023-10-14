const sequelize = require("../utils/database");
const Sequelize = require("sequelize");

const Forgot = sequelize.define(
  "forgots",
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    isactive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Specify the updatedAt field if needed
  }
);

module.exports = Forgot;
