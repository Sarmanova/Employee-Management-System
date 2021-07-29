//Including packages for this application
const fs = require("fs");
const inquirer = require("inquirer");
//const cTable = require("console.table");
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
        "Add  Department",
        "Add  Role",
        "Add Employee",
        "Quit",
    ],
}, ];

const addDepartment = [{
    type: "input",
    message: "What is the name of the department you would like to add?",
    name: "department",
}, ];

const addRole = [{
        type: "input",
        message: "What is the name of the role you would like to add?",
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
        var departmentNames = results;
        addRole[2].choices = departmentNames;
    });


    db.query("SELECT title as name FROM roles", function(err, results) {
        var roleNames = results;
        addEmployee[2].choices = roleNames;
        updateRole[1].choices = roleNames;
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
            case "Add a Department":
                inquirer.prompt(addDepartment).then((departmentResponse) => {
                    var department = departmentResponse.department;
                    db.query(
                        `INSERT INTO department(name)
                                VALUES("${department}");`,
                        function(err, results) {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                console.log("Add!");
                            }
                            askQuestion();
                        }
                    );
                });
                break;
            case "Add a Role":
                inquirer.prompt(addRole).then((roleResponse) => {
                    //Insert new role with name, salary and departments input by the user into database
                    var name = roleResponse.role;
                    var salary = roleResponse.salary;
                    var department = roleResponse.department;
                    db.query(
                        `INSERT INTO roles(department_id, title, salary)
                            VALUES((SELECT id FROM department WHERE name = "${department}"), "${name}", "${salary}");`,
                        function(err, results) {
                            if (err) {
                                console.log(err);
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
                inquirer.prompt(addEmployee).then((employeeResponse) => {
                    //Insert new employee with firstname, lastname, role
                    var firstName = employeeResponse.firstname;
                    var lastName = employeeResponse.lastname;
                    var role = employeeResponse.employeerole;
                    var manager = employeeResponse.employeemanager;

                    if (manager !== "No manager needed") {
                        db.query(
                            `SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = "${manager}"`,
                            function(err, results) {
                                var managerid = results[0].id;
                                var query = `INSERT INTO employee(roles_id, first_name, last_name, manager_id)
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
                        var query = `INSERT INTO employee(roles_id, first_name, last_name)
                                    VALUES((SELECT id FROM roles WHERE title = "${role}"), "${firstName}", "${lastName}");`;
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
                });
                break;
            case "Update Employee Role":
                inquirer.prompt(updateRole).then((updateroleResponse) => {
                    //Update role for employee selected
                    var employee = updateroleResponse.employeeUpdate;
                    var role = updateroleResponse.employeeRoleUpdate;
                    db.query(
                        `UPDATE employee
                            SET roles_id = (SELECT id FROM roles WHERE title = "${role}")
                            WHERE CONCAT(first_name, " ", last_name) = "${employee}"`,
                        function(err, results) {
                            if (err) {
                                console.log(err);
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

// //         .then((answer) => {
// //             // console.log(answer.doWhat);
// //             let question = answer.doWhat;
// //             switch (question) {
// //                 case "View All Employees":
// //                     viewAllEmployees();
// //                     break;
// //                 case "Add Employee":
// //                     addEmployee();
// //                     break;
// //                 case "Add Roles":
// //                     addRoles();
// //                     break;
// //                 case "View Roles":
// //                     viewAllRoles();
// //                     break;
// //                 case "View All Departments":
// //                     viewAllDepartment();
// //                     break;
// //                 case "Add Departments":
// //                     addDepartment();
// //                     break;
// //                 case "Quit":
// //                     return;
// //             }
// //         });
// // }

// function viewAllEmployees() {
//     db.query(
//         "SELECT e.id employee_id, CONCAT(e.first_name, ' ', e.last_name)AS employees_name, roles.title, department.name AS department, roles.salary,CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id INNER JOIN roles ON(roles.id = e.role_id) INNER JOIN department ON(department.id = roles.department_id) ORDER BY e.id;",
//         (err, answer) => {
//             if (err) {
//                 console.log(err);
//             }
//             console.table(answer);
//             firstPrompt();
//         }
//     );

// }

// function viewAllRoles() {
//     db.query(
//         "SELECT title, d.name AS department, salary FROM roles r INNER JOIN department d ON r.department_id = d.id;",
//         (err, answer) => {
//             if (err) {
//                 console.log(err);
//             }
//             console.table(answer);
//             firstPrompt();
//         }
//     );
// }

// function viewAllDepartment() {
//     db.query(
//         "SELECT id, name AS department FROM department;",
//         (err, answer) => {
//             if (err) {
//                 console.log(err);
//             }
//             console.table(answer);
//             firstPrompt();
//         }
//     );
// }
// let roleName = [
//     "Sales Lead",
//     "Salesperson",
//     "Lead Engineering",
//     "Software Engineering",
//     "Account manager",
//     "Accoutant",
//     "Legal Team Lead",
//     "Lawyer",
// ];
// let manName = [
//     " John Doe",
//     "Mike Chan",
//     "Ashlet Rodriguez",
//     "Kevin Tupik",
//     "Kunal Singh",
//     "Malia Brown",
//     "Sarah Lourd",
//     "Tom Allen",
//     "None",
// ];

// function addEmployee() {
//     inquirer
//         .prompt([{
//                 type: "input",
//                 message: "What is employee's first name?",
//                 name: "FirstName",
//             },
//             {
//                 type: "input",
//                 message: "What is employee's last name?",
//                 name: "LastName",
//             },
//             {
//                 type: "list",
//                 message: "What is employee's role?",
//                 name: "emplRole",
//                 choices: roleName,
//             },
//             {
//                 type: "list",
//                 message: "Who is the employee's manager?",
//                 name: "emplManager",
//                 choices: manName,
//             },
//         ])
//         .then((answer) => {
//             console.log(answer);
//             let FirstName = answer.FirstName;
//             let LastName = answer.LastName;
//             let emplRole = answer.emplRole;
//             let emplManager = answer.emplManager;

//             console.log(managerId);
//             db.query(
//                 `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (${FirstName},${LastName},${roleId}','${managerId}')`,
//                 (err, results) => {
//                     if (err) return err;
//                     console.log(`\n Added ${empLastname} to the database!\n `);
//                 }
//             );

//             firstPrompt();
//         });
// }

// function addRoles() {
//     inquirer
//         .prompt([{
//                 type: "input",
//                 message: "What is the name of the role?",
//                 name: "Name",
//             },
//             {
//                 type: "input",
//                 message: "What is the salary  of the role?",
//                 name: "Salary",
//             },

//             {
//                 type: "input",
//                 message: "Which department does the role belong to?",
//                 name: "department",
//                 choices: [],
//             },
//         ])
//         .then((answer) => {
//             console.log(answer);
//             let Name = answer.Name;
//             let Salary = answer.Salary;
//             let department = answer.department;

//             db.query(
//                 `INSERT INTO roles (title, salary, department_id) VALUES((SELECT id FROM department WHERE name = "${department}"), "${Name}", "${Salary}");`,
//                 function(err, answer) {
//                     if (err) {
//                         console.log(err);
//                         return;
//                     } else {
//                         console.log("Added New Roles");
//                     }

//                     firstPrompt();
//                 }
//             );

//         })
// }

// let depName = ["Engineering", "Sales", "Legal", "Finance"];

// function addDepartment() {
//     inquirer
//         .prompt([{
//             type: "list",
//             message: "What is name of the department?",
//             name: "name",
//             choices: depName,
//         }, ])
//         .then((answer) => {
//             console.table(answer)
//             let getname = answer.name;
//             depName.push(getname);
//             db.query(
//                 `INSERT INTO department (name)
//                   VALUES ("${getname}");`,

//                 function(err, answer) {
//                     if (err) return err;

//                     console.log("Added Department");
//                 }
//             );
//             firstPrompt();
//         });

// }
// firstPrompt();