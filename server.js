const express = require("express");
const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");
const index = require("./index")
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());;

// Connect to database
const db = mysql.createConnection({
        host: "localhost",
        // MySQL username,
        user: "root",
        // MySQL password
        password: "Zhansaya1993@",
        database: "corporation_db",
    },
    console.log(`Connected to the corporation_db database.`)
);
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
module.exports = db;