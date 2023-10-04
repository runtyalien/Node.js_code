const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require("../utils/database");

async function showleaderboard(req, res) {
    try {
      // Fetch all users with total expenses
      const usersWithTotalExpenses = await User.findAll({
        attributes: [
          'name',
          [sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'totalExpenses'],
        ],
        include: [
          {
            model: Expense,
            attributes: [],
          },
        ],
        group: ['userexpenses.id'], 
        order: [['totalExpenses', 'DESC']],
      });
  
      usersWithTotalExpenses.forEach(user => {
        console.log(`Name: ${user.name}, Total Expenses: ${user.dataValues.totalExpenses}`);
      });
      res.status(200).json(usersWithTotalExpenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  
  module.exports = { showleaderboard };
