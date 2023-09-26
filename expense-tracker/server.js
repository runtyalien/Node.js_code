const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const app = express();
const port = 3000;

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
      unique: true,
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

app.use(bodyParser.json());

//app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/signup.html");
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
        const user = await User.create({ name, email, password });
        console.log("User registered", user.email);
        res.status(200).json({ message: "Signup successful" });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // This error occurs when the email is already in use.
            res.status(400).json({ error: "Email already in use" });
        } else {
            console.error("Error", error);
            res.status(500).json({ error: "Sign up failed" });
        }
    }
});
