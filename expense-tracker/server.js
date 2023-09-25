const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const app = express();
const port = 3000;

const sequelize = new Sequelize("user-expense", "root", "omkar", {
    host: "localhost",
    dialect: "mysql",
    define: {
        timestamps: true,
        underscored: true,
    },
});

const usersexpense = sequelize.define("usersexpense", {
    id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false,
        unique:true,
        autoIncrement: true,
    },
    name: {
        type:Sequelize.STRING,
        allowNull:false,
    },
    email: {
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    password: {
        type:Sequelize.STRING,
        allowNull:false,
    }, 
})



app.use(bodyParser.json());

//app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/signup.html");
  });

sequelize.sync()
    .then(() => {
        console.log("Database is synced");
        app.listen(port, () => {
            console.log(`Server listening on ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error syncing database", err);
    });


app.post("/signup", async(req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await usersexpense.create({ name, email, password });
        console.log("User registered", user.email);
        res.status(200).json({ message: "Signup successful"});
    } catch (error) {
        console.error("Error",error);
        res.status(500).json({error: "Sign up failed"});
    }
});