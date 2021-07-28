const mysql = require("mysql2");
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

const inquirer = require("inquirer");


function firstPrompt() {
    inquirer
        .prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View Roles",
                "View All Departments",
                "Add Departments",
                "Add Roles",
                "Add Employee",
                "Quit",
            ],
            name: "doWhat",
        }, ])
        .then((answer) => {
            // console.log(answer.doWhat);
            let question = answer.doWhat;
            switch (question) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Roles":
                    addRoles();
                    break;
                case "View Roles":
                    viewAllRoles();
                    break;
                case "View All Departments":
                    viewAllDepartment();
                    break;
                case "Add Departments":
                    addDepartment();
                    break;
                case "Quit":
                    return;
            }
        });
}

function viewAllEmployees() {
    db.query(
        "SELECT e.id employee_id, CONCAT(e.first_name, ' ', e.last_name)AS employees_name, roles.title, department.name AS department, roles.salary,CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id INNER JOIN roles ON(roles.id = e.role_id) INNER JOIN department ON(department.id = roles.department_id) ORDER BY e.id;",
        (err, answer) => {
            if (err) {
                console.log(err);
            }
            console.table(answer);
            firstPrompt();
        }
    );

}

function viewAllRoles() {
    db.query(
        "SELECT title, d.name AS department, salary FROM roles r INNER JOIN department d ON r.department_id = d.id;",
        (err, answer) => {
            if (err) {
                console.log(err);
            }
            console.table(answer);
            firstPrompt();
        }
    );
}

function viewAllDepartment() {
    db.query(
        "SELECT id, name AS department FROM department;",
        (err, answer) => {
            if (err) {
                console.log(err);
            }
            console.table(answer);
            firstPrompt();
        }
    );
}
let roleName = [
    "Sales Lead",
    "Salesperson",
    "Lead Engineering",
    "Software Engineering",
    "Account manager",
    "Accoutant",
    "Legal Team Lead",
    "Lawyer",
];
let manName = [
    " John Doe",
    "Mike Chan",
    "Ashlet Rodriguez",
    "Kevin Tupik",
    "Kunal Singh",
    "Malia Brown",
    "Sarah Lourd",
    "Tom Allen",
    "None",
];


function addEmployee() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is employee's first name?",
                name: "FirstName",
            },
            {
                type: "input",
                message: "What is employee's last name?",
                name: "LastName",
            },
            {
                type: "list",
                message: "What is employee's role?",
                name: "emplRole",
                choices: roleName,
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "emplManager",
                choices: manName,
            },
        ])
        .then((answer) => {
            console.log(answer);
            let FirstName = answer.FirstName;
            let LastName = answer.LastName;
            let emplRole = answer.emplRole;
            let emplManager = answer.emplManager;
            let roleId;
            for (let i = 0; i < roleName.length; i++) {
                if (emplRole == roleName[i].title) {
                    roleId = roleName[i].id;
                }
            }
            console.log(roleId);
            let managerId;
            for (let i = 0; i < manName.length; i++) {
                if (emplManager == manName[i].title) {
                    managerId = manName[i].id;
                }
            }
            console.log(managerId);
            db.query(
                `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (${FirstName},${LastName},${roleId}','${emplManager}')`,
                (err, results) => {
                    if (err) return err;
                    console.log(`\n Added ${empLastname} to the database!\n `);
                }
            );

            firstPrompt();
        });
}

// function allRoles() {
//     db.query(
//         "SELECT id, title, salary, department_id FROM roles;",
//         function(err, answer) {
//             if (err) {
//                 console.log(err);
//             }

//             answer.forEach((title) => {
//                 roleName.push(title);
//             });
//         }
//     );
//     return allRoles;
// }

function addRoles() {
    inquirer
        .prompt([{
                type: "input",
                message: "What is the name of the role?",
                name: "Name",
            },
            {
                type: "input",
                message: "What is the salary  of the role?",
                name: "Rolesalary",
            },

            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "depRole",
                choices: roleName,
            },
        ])
        .then((answer) => {
            console.log(answer);
            let Name = answer.Name;
            let Rolesalary = answer.Rolesalary;
            let depRole = answer.depRole;
            let departmentId;
            for (let i = 0; i < roleName.length; i++) {
                if (depRole == roleName[i].name) {
                    departmentId = roleName[i].id;
                }
            }
            console.log(departmentId);
            db.query(
                `INSERT INTO roles (title, salary, department_id) VALUES("${Name}", ${Rolesalary}, ${departmentId});`,
                function(err, results) {
                    if (err) return err;
                    console.log("Added New Roles");
                }
            );
            firstPrompt();
        })
}

let depName = ["Engineering", "Sales", "Legal", "Finance"];

function addDepartment() {
    inquirer
        .prompt([{
            type: "list",
            message: "What is name of the department?",
            name: "name",
            choices: depName,
        }, ])
        .then((answer) => {
            console.table(answer)
            let getname = answer.name;
            depName.push(getname);
            db.query(
                `INSERT INTO department (name)
                  VALUES ("${getname}");`,

                function(err, answer) {
                    if (err) return err;

                    console.log("Added Department");
                }
            );
            firstPrompt();
        });


}
firstPrompt();
// allRoles();