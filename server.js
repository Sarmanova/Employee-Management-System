const express = require("express")
    // Import and require mysql2
const mysql = require("mysql2");
const index = require("./index")
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());;

// Connect to database
const db = mysql.connectedMysql({
        host: "localhost",
        // MySQL username,
        user: "root",
        // MySQL password
        password: "Zhansaya1993@",
        database: "corporation_db",
    },
    console.log(`Connected to the corporation_db database.`)
);
db.query("SELECT * FROM employees", function(err, results) {
    console.log(results);
});
db.query("SELECT * FROM roles", function(err, results) {
    console.log(results);
});
db.query("SELECT * FROM department", function(err, results) {
    console.log(results);
});
// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});