const User = require('../model/user');
const Expense = require('../model/expense');

async function showleaderboard(req, res) {
    try {
      // Fetch all users
      const users = await User.findAll();
  
      // Calculate total expenses for each user
      const usersWithTotalExpenses = await Promise.all(
        users.map(async (user) => {
          if (user.id !== undefined && user.id !== null) {
            const totalExpenses = await Expense.sum('amount', {
              where: { userexpenseId: user.id },
            });
      
            console.log(user.id);
            console.log(totalExpenses);
      
            return {
              username: user.name,
              totalExpenses,
            };
          } else {
            console.log(`user.userexpenseId is not defined for ${user.name} ${user.id}`);
            return null;
          }
        })
      );
      
      // Filter out null entries
      const filteredUsersWithTotalExpenses = usersWithTotalExpenses.filter(Boolean);
      
      // Sort and respond
      filteredUsersWithTotalExpenses.sort((a, b) => b.totalExpenses - a.totalExpenses);
      res.status(200).json(filteredUsersWithTotalExpenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

module.exports = { showleaderboard };