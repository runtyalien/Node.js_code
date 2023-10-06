/*const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const sequelize = require("./utils/database");

//importing controllers
const loginController = require("./controller/login");
const expenseController = require("./controller/expense");
const purchaseController = require("./controller/purchase");
const premiumController = require("./controller/premium");

//importing middleware
//const extractUserId = require("./middleware/extractUserId");
const Expense = require("./model/expense");
const User = require("./model/user");

const app = express();
const port = 3000;

app.use(bodyParser.json());

User.hasMany(Expense);
Expense.belongsTo(User);

//app.use(express.static("public"));

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
  );
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/signup.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/expense", (req, res) => {
  res.sendFile(__dirname + "/views/expense.html");
});

sequelize
  .sync({})
  .then(() => {
    console.log("Database is synced");
    app.listen(port, () => {
      console.log(`Server listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database", err);
  });

app.post("/signup", loginController.signUp);

// Login functionality

app.post("/login", loginController.login);

// Middleware to extract userId from JWT token
async function extractUserId(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Missing Authorization header" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
    );
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - Missing userId" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    // Set userId in the request object for later use
    req.userId = userId;
    req.user = user;

    console.log("User ID extracted:", userId);
    console.log("User:", user.toJSON());

    next();
  } catch (error) {
    console.log("Error decoding token", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

// Use the middleware in the /expense route
app.post("/expense", extractUserId, expenseController.addExpense);

app.delete("/expense/:id" , expenseController.deleteExpense);

app.get("/expenses", expenseController.showExpense);

//buy premium

// Use the middleware in the /purchase/premium route
app.get("/purchase/premium", purchaseController.buymembership);

//update purchase
app.post(
  "/purchase/updatepremium",
  extractUserId,
  purchaseController.updatetransaction
);

//show leaderboard
app.get("/premium/showleaderboard", premiumController.showleaderboard);
*/

const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require('razorpay');
const sequelize = require('./utils/database');


//importing controllers
const loginController = require("./controller/login");
const expenseController = require("./controller/expense");
const purchaseController = require("./controller/purchase");
const premiumController = require("./controller/premium");

//importing middleware
//const extractUserId = require("./middleware/extractUserId");
const Expense = require("./model/expense");
const User = require("./model/user");


const app = express();
const port = 3000;

app.use(bodyParser.json());

User.hasMany(Expense);
Expense.belongsTo(User);

//app.use(express.static("public"));

function generateAccessToken(id, name) {
  return jwt.sign(
    { userId: id, name: name },
    "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
  );
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/signup.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/expense", (req, res) => {
  res.sendFile(__dirname + "/views/expense.html");
});



sequelize
  .sync({})
  .then(() => {
    console.log("Database is synced");
    app.listen(port, () => {
      console.log(`Server listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database", err);
  });

app.post("/signup", loginController.signUp);

// Login functionality

app.post("/login", loginController.login );


// Middleware to extract userId from JWT token
async function extractUserId(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing Authorization header" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
    );
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - Missing userId" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    // Set userId in the request object for later use
    req.userId = userId;
    req.user = user;
    next();
  } catch (error) {
    console.log("Error decoding token", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

// Use the middleware in the /expense route
app.post("/expense", extractUserId, async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    const expense = await Expense.create({
      amount,
      description,
      category,
      userexpenseId: req.userId,
    });

    const totalExpense = Number(req.user.total) + Number(amount)
    console.log(totalExpense);

    User.update({
      total: totalExpense
    }, {
      where: {id : req.userId}
    })

    console.log("Expense ", expense.toJSON());
    res.status(201).json(expense);
    console.log("User total updated", req.user.total);
  } catch (err) {
    console.error("Error catching expense", err);
    res.status(500).json({ error: "Errors catching expense" });
  }
});

app.delete("/expense/:id", expenseController.deleteExpense);

app.get("/expenses", expenseController.showExpense );

//buy premium

// Use the middleware in the /purchase/premium route
app.get('/purchase/premium', extractUserId, purchaseController.buymembership );

//update purchase
app.post('/purchase/updatepremium', extractUserId, purchaseController.updatetransaction );

//show leaderboard
app.get('/premium/showleaderboard',  premiumController.showleaderboard );