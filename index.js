const inquirer = require("inquirer")
const server = require("./server")
const employee = require("./lib/employee")
const role = require("./lib/role")
const deparment = require("./lib/deparment")
const { response } = require("express")

const firstquestions = [{
    type: "list",
    message: "What would you like to do?",
    name: "doWhat",
    choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View Roles",
        "View All Departments",
        "Add Departments",
        "Quit",
    ],
}, ];
const employeeQuestion = [{
    type: 'input',
    message: "What is employee's first name?",
    name: 'first name',

}, {
    type: 'input',
    message: "What is employee's last name?",
    name: 'last name',

}, {
    type: 'list',
    message: "What is employee's role?",
    name: 'role',
    choices: ["Sales Lead", "Salesperson", "Lead Engineering", "Software Engineering", "Account manager", "Accoutant", "Legal Team Lead", "Lawyer"]
}, {
    type: 'list',
    message: "Who is the employee's manager?",
    name: 'manager',
    choices: [" John Doe", "Mike Chan", "Ashlet Rodriguez", "Kevin Tupik", "Kunal Singh", "Malia Brown", "Sarah Lourd", "Tom Allen", "None"]
}]
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

inquirer.prompt(firstquestions).then((res) => {
    let question = response.question;
    switch (question) {
        case "View All Employees":
            viewAllEmployees();
            break;
        case "Add Employee":
            addEmployee();
            break;
        case "Remove Employee":
            removeEmployee();
            break;
        case "Update Employee Roles":
            updateEmployeeRoles();
            break;
        case "View Roles":
            viewRoles();
            break;
        case "View All Department":
            viewAlDepartment();
            break;
        case "Add Department":
            addDepartment();
            break;
        case "Quit":
            quit();
            break;
    }



});