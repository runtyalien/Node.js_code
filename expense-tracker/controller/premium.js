const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require("../utils/database");


async function showleaderboard(req, res) {
  /*try {
    // Fetch all users with total expenses
    const usersWithTotalExpenses = await User.findAll({
      attributes: [
        "id","name",
        [
          sequelize.fn("SUM", sequelize.col("Expenses.amount")),
          "totalExpenses",
        ],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["userexpenses.id"],
      order: [["totalExpenses", "DESC"]],
    });

    usersWithTotalExpenses.forEach((user) => {
      console.log(
        `Name: ${user.name}, Total Expenses: ${user.dataValues.totalExpenses}`
      );
    });
    res.status(200).json(usersWithTotalExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }*/

  try{
    const leaderboardofExpenses = await User.findAll({
      order: [['total', 'DESC']]
    })

    leaderboardofExpenses.forEach(user => {
      console.log(`User: ${user.name}, Total Expense: ${user.total}`);
    });

    res.status(200).json(leaderboardofExpenses);
  } catch(err){
    console.log(err);
    res.status(500).json(err);
  }
}

module.exports = { showleaderboard };

/*
  async function showleaderboard(req, res):

This function is an asynchronous function that handles a request (req) and a response (res). It is likely part of an Express.js route.
try { ... } catch (error) { ... }:

The code is wrapped in a try-catch block, which is a way to handle errors. If an error occurs within the try block, it is caught, and the error-handling code in the catch block is executed.
const usersWithTotalExpenses = await User.findAll({ ... });:

It uses Sequelize's User model to fetch all users along with the total expenses for each user. The await keyword is used to wait for the asynchronous operation to complete.
attributes: ["name", [sequelize.fn("SUM", sequelize.col("Expenses.amount")), "totalExpenses"]],:

Specifies the attributes to be selected in the query. It includes the user's name and the total expenses using the SUM function on the Expenses.amount column. The result is aliased as totalExpenses.
include: [{ model: Expense, attributes: [] }],:

Specifies that the query should include the Expense model (a related model) but only select attributes specified in the attributes: [] array (in this case, none).
group: ["userexpenses.id"],:

Groups the results based on the userexpenses.id column. This is necessary because we are using aggregate functions (SUM) and non-aggregated columns in the select clause.
order: [["totalExpenses", "DESC"]],:

Orders the results by the totalExpenses column in descending order (DESC).
usersWithTotalExpenses.forEach((user) => { ... });:

Iterates through the results and logs the name and total expenses for each user. This is for debugging purposes.
res.status(200).json(usersWithTotalExpenses);:

Sends a JSON response to the client with the fetched data. The status code is set to 200 (OK).
catch (error) { ... }:

Handles errors. If there's an error in the try block, it logs the error and sends a JSON response to the client with a status code of 500 (Internal Server Error).
*/