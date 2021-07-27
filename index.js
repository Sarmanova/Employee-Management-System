const inquirer = require("inquirer")
    // const server = require("./server")
    // const employee = require("./lib/employee")
    // const roles = require("./lib/role")
    // const deparment = require("./lib/deparment")
const db = require("./server");



const firstquestions = [{
    type: "list",
    message: "What would you like to do?",
    choices: [
        "View All Employees",
        "View Roles",
        "View All Departments",
        "Add Departments",
        "Add Roles",
        "Add Employee",
        "Quit"
    ],
    name: "doWhat"
}];
const employeeQuestion = [{
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
];
const roleQuestion = [{
        type: 'list',
        message: "Which employee's role do you want to update?",
        name: 'update',
        choices: ["John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik",
            "Kunal Singh", "Malia Brown", "Sarah Lourd", "Tom Nelson"
        ]
    },
    {
        type: 'input',
        message: "What is the name of the role?",
        name: 'role',

    },
    {
        type: 'input',
        message: "What is the salary  of the role?",
        name: 'salary',

    }
]
const departmentQuestion = [{
        type: "list",
        message: "What is name of the department?",
        name: "name",
        choices: ["Engineering", "Sales", "Legal", "Finance"],
    },
    {
        type: "list",
        message: "Which department does the role belong to?",
        name: "belong",
        choices: ["Engineering", "Sales", "Legal", "Finance"],
    },
];

function firstPrompt() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View Roles",
            "View All Departments",
            "Add Departments",
            "Add Roles",
            "Add Employee",
            "Quit"
        ],
        name: "doWhat"
    }]).then((answer) => {
        let question = answer.question;
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
            case "View All Department":
                viewAllDepartment();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Quit":
                db.end();
                return;
        }
    });
}

function viewAllEmployees() {
    db.query(
        `SELECT e.id employee_id, CONCAT(e.first_name, ' ', e.last_name)
         AS employees_name, roles.title, department.name AS department, roles.salary,
         CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e
         LEFT JOIN employees m ON e.manager_id = m.id INNER JOIN roles
         ON (roles.id = e.role_id) INNER JOIN department ON (department.id = roles.department_id)
         ORDER BY e.id;`, (err, answer) => {
            if (err) {
                console.log(err);
            }
            console.log(answer);
        }
    );
    firstPrompt();
};


function addEmployee() {
    inquirer.prompt(employeeQuestion).then((answer) => {
        let getFirstName = answer.getFirstName;
        let getlastName = answer.getlastName;
        let employeeRole = answer.employeeRole;
        let employeeManager = answer.employeeManager;

        const newEmployees = new Employees(
            getFirstName,
            getlastName,
            employeeRole,
            employeeManager
        );
        console.log(newEmployees);

    });
    firstPrompt();

}

function addRoles() {
    inquirer.prompt(roleQuestion).then((answer) => {
        let getTitle = answer.getTitle;
        let getSalary = answer.getSalary;
        let getDepartment = answer.getDepartment;
        const addNewRole = new Role(getTitle, getSalary, getDepartment);
        console.log(addNewRole);

    });
    firstPrompt();

}

function viewAllRoles() {
    db.query(
        `SELECT  title, d.name AS department, salary FROM roles r 
          INNER JOIN department d ON r.department_id = d.id;`,
        function(err, results) {
            if (err) {
                console.log(err);
            }
            console.log(results);
        }
    );
    firstPrompt();
}

function viewAllDepartment() {
    db.query(
        "SELECT  id,name AS department FROM department",
        function(err, results) {
            if (err) {
                console.log(err);
            }
            console.log(results);
        }
    );
    firstPrompt();

}

function addDepartment() {
    inquirer.prompt(departmentQuestion).then((answer) => {
        let getName = answer.getName;
        const addNewdepartment = new Role(getName);
        console.log(addNewdepartment);

    });
    firstPrompt();

}
firstPrompt();