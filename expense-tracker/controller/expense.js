const express = require("express");
const router = express.Router();
const sequelize = require("../utils/database");
const Expense = require("../model/expense");
const user = require("../model/user");

async function addExpense(req, res) {
  const { amount, description, category } = req.body;

  try {
    const expense = await Expense.create({
      amount,
      description,
      category,
      userexpenseId
    });

    const totalExpense = Number(req.user.total) + Number(amount)
    console.log(totalExpense);

    console.log("Expense ", expense.toJSON());
    res.status(201).json(expense);
    console.log("User total updated", user.total);
  } catch (err) {
    console.error("Error catching expense", err);
    res.status(500).json({ error: "Errors catching expense" });
  }
};



/*async function addExpense(req, res) {
  const { amount, description, category } = req.body;

  Expense.create({
    amount,
    description,
    category,
  })
    .then((expense) => {
      console.log("Expense created", expense.toJSON());
      console.log(expense);
      res.status(201).json(expense);
    })
    .catch((err) => {
      console.error("Error catching expense", err);
      res.status(500).json({ error: "Errors catching expense" });
    });
};*/

async function deleteExpense(req, res) {
  const expenseId = req.params.id;
  Expense.findByPk(expenseId)
    .then((expense) => {
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      return expense.destroy();
    })
    .then(() => {
      console.log("Expense deleted");
      res.status(204).send();
    })
    .catch((error) => {
      console.log("Error deleting expense", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error deleting user" });
      }
    });
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
