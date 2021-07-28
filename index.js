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
            console.log(answer.doWhat);
            let question = answer.doWhat;
            switch (question) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employees":
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
            console.log(answer);
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
            console.log(answer);
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
            console.log(answer);
            firstPrompt();
        }
    );
}

function addEmployee() {
    inquirer.prompt([{
            type: "input",
            message: "What is employee's first name?",
            name: "first name",
        },
        {
            type: "input",
            message: "What is employee's last name?",
            name: "last name",
        },
        {
            type: "list",
            message: "What is employee's role?",
            name: "role",
            choices: [
                "Sales Lead",
                "Salesperson",
                "Lead Engineering",
                "Software Engineering",
                "Account manager",
                "Accoutant",
                "Legal Team Lead",
                "Lawyer",
            ],
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            name: "manager",
            choices: [
                " John Doe",
                "Mike Chan",
                "Ashlet Rodriguez",
                "Kevin Tupik",
                "Kunal Singh",
                "Malia Brown",
                "Sarah Lourd",
                "Tom Allen",
                "None",
            ],
        },
    ]).then((answer) => {
        let emplFname = answer.emplFname;
        let emplLname = answer.emplLname;
        let emplRole = answer.emplRole;
        let emplManager = answer.emplManager;
        db.query(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${emplFname}", "${emplLname}", "${emplRole}", "${emplManager}");`,
            (err, results) => {
                if (err) return err;
                console.log(`\n Added ${emplFname} to the database! \n`);
            }
        );

        // Check for what to do next
        firstPrompt();
    });
}

function addRoles() {
    inquirer.prompt([{
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "update",
            choices: [
                "John Doe",
                "Mike Chan",
                "Ashley Rodriguez",
                "Kevin Tupik",
                "Kunal Singh",
                "Malia Brown",
                "Sarah Lourd",
                "Tom Nelson",
            ],
        },
        {
            type: "input",
            message: "What is the name of the role?",
            name: "role",
        },
        {
            type: "input",
            message: "What is the salary  of the role?",
            name: "salary",
        },
    ]).then((answer) => {
        let getTitle = answer.getTitle;
        let getSalary = answer.getSalary;
        let getDepartment = answer.getDepartment;
        const addNewRole = new Role(getTitle, getSalary, getDepartment);
        console.log(addNewRole);
        firstPrompt();
    });

}

let depName = ["Engineering", "Sales", "Legal", "Finance"];

function addDepartment() {
    inquirer
        .prompt([{
                type: "list",
                message: "What is name of the department?",
                name: "name",
                choices: ["Engineering", "Sales", "Legal", "Finance"],
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "belong",
                choices: depName,
            },
        ])
        .then((answer) => {
            console.log("hit")
            let getName = answer.getName;
            depName.push(getName);
            db.query(
                `INSERT INTO department (name) VALUES ("${getName}");`,
                function(err, answer) {
                    if (err) return err;

                    console.log("\n Added Department! \n");
                }
            );
            firstPrompt();
        });

}
firstPrompt();