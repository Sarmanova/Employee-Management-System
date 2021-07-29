//Including packages for this application
//const fs = require("fs");
const inquirer = require("inquirer");

const express = require("express");
// Import and require mysql2
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

//Presents the user with options to choose
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
    message: "What is the name of the department?",
    name: "department",
}, ];

const addRole = [{
        type: "input",
        message: "What is the name of the role?",
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

function init() {
    db.query("SELECT name FROM department", function(err, results) {
        let departmentNames = results;
        addRole[2].choices = departmentNames;
    });

    db.query("SELECT title as name FROM roles", function(err, results) {
        var roleNames = results;
        addEmployee[2].choices = roleNames;
        //updateRole[1].choices = roleNames;
    });

    db.query(
        'SELECT CONCAT(first_name, " ", last_name) as name FROM employee WHERE manager_id is null',
        function(err, results) {
            var managerNames = results;
            addEmployee[3].choices = managerNames;
            addEmployee[3].choices.push("No manager needed");
        }
    );

    db.query(
        'SELECT CONCAT(first_name, " ", last_name) as name FROM employee',
        function(err, results) {
            var employeeNames = results;
            updateRole[0].choices = employeeNames;
        }
    );

    askQuestion();
}

function askQuestion() {
    inquirer.prompt(allOptions).then((allOptionsResponses) => {
        // Switch cases
        var userSelection = allOptionsResponses.useroption;
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
            case "Add Department":
                inquirer.prompt(addDepartment).then((departmentResponse) => {
                    var department = departmentResponse.department;
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
            case "Add Role":
                inquirer.prompt(addRole).then(async(answer) => {
                    let name = answer.role;
                    let salary = answer.salary;
                    let department = answer.department;
                    let departmentId = await convertDeparmentId(department);
                    db.query(
                        `INSERT INTO roles(department_id, title, salary)
                            VALUES(?,?,?);`, [departmentId, name, salary],
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
            case "Add Employee":
                inquirer.prompt(addEmployee).then(async(answer) => {
                    //Insert new employee with firstname, lastname, role
                    let firstName = answer.firstname;
                    let lastName = answer.lastname;
                    let role = answer.employeerole;
                    let manager = answer.employeemanager;
                    let roleId = await convertRoleToId(role);
                    let managerId = await convertMgrToId(manager);
                    db.query(
                        `INSERT INTO employee(role_id, first_name, last_name, manager_id)
                          VALUES (?,?,?,?);`, [roleId, firstName, lastName, managerId],
                        function(err, results) {
                            console.log(err);
                        },
                        console.log("Added!")
                    );
                    askQuestion();
                });
        }
    });
}
// Converting string to number 
const convertDeparmentId = (department) => {
    return new Promise(function(resolve, reject) {
        db.query(
            `SELECT * FROM department  WHERE  name LIKE '%${department}%';`,
            function(err, results) {
                if (err) throw err;
                let id = results[0].id;
                resolve(id);
            }
        );
    });
};
const convertRoleToId = (role) => {
    return new Promise(function(resolve, reject) {
        db.query(
            `SELECT * FROM roles WHERE title LIKE '%${role}%';`,
            function(err, results) {
                if (err) throw err;
                let id = results[0].id;
                resolve(id);
            }
        );
    });
};
const convertMgrToId = (mgr) => {
    return new Promise(function(resolve, reject) {
        db.query(
            `SELECT * FROM employee WHERE CONCAT(first_name, ' ', last_name) LIKE '%${mgr}%';`,
            function(err, results) {
                if (err) throw err;
                let id = results[0].id;
                resolve(id);
            }
        );
    });
};
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

init();