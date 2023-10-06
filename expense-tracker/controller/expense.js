const express = require("express");
const router = express.Router();
const sequelize = require("../utils/database");
const Expense = require("../model/expense");
const user = require("../model/user");
const User = require("../model/user");

async function addExpense(req, res) {
  const t = await sequelize.transaction();

  try {
    const { amount, description, category } = req.body;

    const expense = await Expense.create(
      {
        amount,
        description,
        category,
        //userexpenseId: req.userId,
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.total) + Number(amount);

    await User.update(
      { total: totalExpense },
      {
        where: { id: req.userId },
        transaction: t,
      }
    );

    // Commit the transaction
    await t.commit();

    console.log("Expense created", expense.toJSON());
    console.log("User total updated", totalExpense);
    res.status(201).json(expense);
  } catch (err) {
    // Rollback the transaction in case of an error
    await t.rollback();

    console.error("Error creating expense or updating user total", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function deleteExpense(req, res) {
  const expenseId = req.params.id;
  const t = await  sequelize.transaction();

  try {
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    
    const user = await User.findByPk(expense.userexpenseId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalExpense = Number(user.total) - Number(expense.amount);
    console.log(totalExpense);

    await expense.destroy();

    // Update user's total expense
    await User.update({ total: totalExpense }, { where: { id: user.id }, transaction: t });

    await t.commit();

    console.log("Expense deleted");
    res.status(204).send();
  } catch (error) {
    await t.rollback();
    console.log("Error deleting expense", error);
    res.status(500).json({ error: "Error deleting user" });
  }
}


async function showExpense(req, res) {
  Expense.findAll()
    .then((expenses) => {
      console.log("Users retrieved", expenses);
      res.status(200).json(expenses);
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Error retrieving users" });
    });
}

module.exports = {
  addExpense,
  deleteExpense,
  showExpense,
};
