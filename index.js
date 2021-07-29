const fs = require("fs");
const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
        host: "localhost",
        // MySQL username,
        user: "root",
        // MySQL password
        password: "Zhansaya1993@",
        database: "corporation_db",
        multipleStatements: true,
    },
    console.log(`Connected to the corporation_db database.`)
);


const allOptions = [{
    type: "list",
    message: "What would you like to do?",
    name: "useroption",
    choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Quit",
    ],
}, ];

const addDepartment = [{
    type: "input",
    message: "What is the name of the department ?",
    name: "department",
}, ];

const addRole = [{
        type: "input",
        message: "What is the name of the role ?",
        name: "role",
    },
    {
        type: "input",
        message: "What is the salary for this role?",
        name: "salary",
    },
    {
        type: "list",
        message: "Which department does the role belong to?",
        name: "department",
        choices: [],
    },
];

const addEmployee = [{
        type: "input",
        message: "What is the employee's first name?",
        name: "firstname",
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastname",
    },
    {
        type: "list",
        message: "What is the employee's role?",
        name: "employeerole",
        choices: [],
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        name: "employeemanager",
        choices: [],
    },
];

const updateRole = [{
        type: "list",
        message: "Which employee would you like to update?",
        name: "employeeUpdate",
        choices: [],
    },
    {
        type: "list",
        message: "Which role did you want to assign to them?",
        name: "employeeRoleUpdate",
        choices: [],
    },
];

// Function to initialize app
function init() {
    //Populate roledepartment dropdown with the values currently in the Database
    db.query("SELECT name FROM department", function(err, results) {
        let departmentNames = results;
        addRole[2].choices = departmentNames;
    });

    //Populate role dropdown with the values correctly in the Database
    db.query("SELECT title as name FROM roles", function(err, results) {
        let roleNames = results;
        addEmployee[2].choices = roleNames;
        updateRole[1].choices = roleNames;
    });

    //Populate manager dropdown with the managers in the employees table
    db.query(
        'SELECT CONCAT(first_name, " ", last_name) as name FROM employee WHERE manager_id is null',
        function(err, results) {
            let managerNames = results;
            addEmployee[3].choices = managerNames;
            addEmployee[3].choices.push("No manager needed");
        }
    );

    //Populate employee dropdown with all employees in employees table
    db.query(
        'SELECT CONCAT(first_name, " ", last_name) as name FROM employee',
        function(err, results) {
            let employeeNames = results;
            updateRole[0].choices = employeeNames;
        }
    );

    askQuestion();
}

function askQuestion() {
    inquirer.prompt(allOptions).then((allOptionsResponses) => {
        // Switch cases
        let userSelection = allOptionsResponses.useroption;
        switch (userSelection) {
            case "View All Departments":
                db.query("SELECT * FROM department", function(err, results) {
                    console.table(results);
                    askQuestion();
                });
                break;
            case "View All Roles":
                db.query("SELECT * FROM roles", function(err, results) {
                    console.table(results);
                    askQuestion();
                });
                break;
            case "View All Employees":
                db.query("SELECT * from employee", function(err, results) {
                    console.table(results);
                    askQuestion();
                });
                break;
            case "Add a Department":
                inquirer.prompt(addDepartment).then((departmentResponse) => {
                    let department = departmentResponse.department;
                    db.query(
                        `INSERT INTO department(name)
                                VALUES("${department}");`,
                        function(err, results) {
                            if (err) {
                                console.log("error:" + err.message);
                                return;
                            } else {
                                console.log("Added!");
                            }
                            askQuestion();
                        }
                    );
                });
                break;
            case "Add a Role":
                inquirer.prompt(addRole).then((roleResponse) => {

                    let name = roleResponse.role;
                    let salary = roleResponse.salary;
                    let department = roleResponse.department;
                    db.query(
                        `INSERT INTO roles(department_id, title, salary)
                            VALUES((SELECT id FROM department WHERE name = "${department}"), "${name}", "${salary}");`,
                        function(err, results) {
                            if (err) {
                                console.log("error:" + err.message);
                                return;
                            } else {
                                console.log("Added!");
                            }
                            askQuestion();
                        }
                    );
                });
                break;
            case "Add an Employee":
                inquirer.prompt(addEmployee).then((employeeResponse) => {

                    let firstName = employeeResponse.firstname;
                    let lastName = employeeResponse.lastname;
                    let role = employeeResponse.employeerole;
                    let manager = employeeResponse.employeemanager;

                    if (manager !== "No manager needed") {
                        db.query(
                            `SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = "${manager}"`,
                            function(err, results) {
                                let managerid = results[0].id;
                                let query = `INSERT INTO employee(roles_id, first_name, last_name, manager_id)
                                    VALUES((SELECT id FROM roles WHERE title = "${role}"), "${firstName}", "${lastName}", ${managerid});`;
                                db.query(query, function(err, results) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    } else {
                                        console.log("Added!");
                                    }
                                    askQuestion();
                                });
                            }
                        );
                    } else {
                        let query = `INSERT INTO employee(roles_id, first_name, last_name)
                                    VALUES((SELECT id FROM roles WHERE title = "${role}"), "${firstName}", "${lastName}");`;
                        db.query(query, function(err, results) {
                            if (err) {
                                console.log("error:" + err.message);
                                return;
                            } else {
                                console.log("Added!");
                            }
                            askQuestion();
                        });
                    }
                });
                break;
            case "Update an Employee Role":
                inquirer.prompt(updateRole).then((updateroleResponse) => {
                    //Update role for employee selected
                    let employee = updateroleResponse.employeeUpdate;
                    let role = updateroleResponse.employeeRoleUpdate;
                    db.query(
                        `UPDATE employee
                            SET roles_id = (SELECT id FROM roles WHERE title = "${role}")
                            WHERE CONCAT(first_name, " ", last_name) = "${employee}"`,
                        function(err, results) {
                            if (err) {
                                console.log("error:" + err.message);
                                return;
                            } else {
                                console.log("Added!");
                            }
                            askQuestion();
                        }
                    );
                });
                break;
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

init();