const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require('razorpay');
const loginController = require("./controller/login");
const expenseController = require("./controller/expense");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize("usersexpense", "root", "omkar", {
  host: "localhost",
  dialect: "mysql",
});

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
  },
  {
    timestamps: false,
  }
);

const Expense = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.STRING,
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
});

const Order = sequelize.define("order", {
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
  });


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
  .sync()
  .then(() => {
    console.log("Database is synced");
    app.listen(port, () => {
      console.log(`Server listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database", err);
  });

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ name, email, password: hashedPassword });
      console.log("User registered", user.email);
      res.status(200).json({ message: "Signup successful" });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Sign up failed" });
  }
});

// Login functionality

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    console.log("Entered email:", user.email);
    console.log("Entered Password:", password);
    console.log("Database Password:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          token: generateAccessToken(user.id, user.name),
        });
      //return res.redirect('/expense');
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "User not authorized" });
  }
});


// Middleware to extract userId from JWT token
function extractUserId(req, res, next) {
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

    // Set userId in the request object for later use
    req.userId = userId;
    next();
  } catch (error) {
    console.log("Error decoding token", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}
/*app.post("/expense", async (req, res) => {
  const { amount, description, category } = req.body;
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(
      token,
      "aff135734abed1bf492684a890eb7d59081b5f44b23ded12a7339451b9bc2048"
    );
    const userId = decoded.userId;
    console.log("Decoded userId", userId);

    const expense = await Expense.create({
      amount,
      description,
      category,
      userexpenseId: userId,
    })

    console.log("Expense created", expense.toJSON());
    res.status(201).json(expense);
  } catch (error) {
    console.log("Error decoding token", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});*/

//new function delete and revert if does't work
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

    console.log("Expense created", expense.toJSON());
    res.status(201).json(expense);
  } catch (error) {
    console.log("Error creating expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/expense/:id", async (req, res) => {
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
});

app.get("/expenses", async (req, res) => {
  Expense.findAll()
    .then((expenses) => {
      console.log("Users retrieved", expenses);
      res.status(200).json(expenses);
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
      res.status(500).json({ error: "Error retrieving users" });
    });
});

//buy premium
/*app.get('/purchase/premium', async (req, res) =>{
  try {
    var rzp = new Razorpay({
      key_id: 'rzp_test_NgSvjK0wZJZoOU',
      key_secret: 'OjmOCbvC4W6frLQk5wbj1gWn',
    });
    const amount = 25000;
    console.log('User ID:', req.userId);
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong " });
      } else {
        await Order.create({ 
          orderid: order.id,
          status: "PENDING",
          paymentid:order.amount_paid,
          userId:req.userId,
         });
        res.status(201).json({ order, key_id: rzp.key_id });
      }
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong " });
  }
});*/

//new fucntion delete if doen't work
// Use the middleware in the /purchase/premium route
app.get('/purchase/premium', extractUserId, async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: 'rzp_test_NgSvjK0wZJZoOU',
      key_secret: 'OjmOCbvC4W6frLQk5wbj1gWn',
    });
    const amount = 25000;
    console.log('User ID:', req.userId);
    
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong " });
      } else {
        await Order.create({ 
          orderid: order.id,
          status: "PENDING",
          paymentid: order.amount_paid,
          userId: req.userId,
        });
        res.status(201).json({ order, key_id: rzp.key_id });
      }
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong " });
  }
});

//update purchase
app.post('/purchase/updatepremium', async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ orderid: order_id });
    await order.updateOne(
      { payment_id: payment_id, status: "Successfull" }
    );
    await USERS.findOneAndUpdate({_id:req.user._id},{ isPremiumUser: true });
    res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    console.log(err)

    res.status(500).json({ message: "Something went wrong " });
  }
});
