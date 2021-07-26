const inquirer = require("inquirer")
const server = require("./server")
const employee = require("./lib/employee")
const role = require("./lib/role")
const deparment = require("./lib/deparment")
const questions = [{
        type: 'list',
        message: 'What would you like to do?',
        name: 'doWhat',
        choices: ["Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Employees",
            "View All Employees By Department", "View All Employees By Manager", "Add Role", "View All Roles", "Romove Role", "View Total Utilized Budget By Deparment",
            "Quit"
        ]
    },
    {
        type: 'list',
        message: "Which employee's role do you want to update?",
        name: 'update',
        choices: ["John Doe", "Mike Chan", "Ashley Rodriguez", "Kevin Tupik",
            "Kunal Singh", "Malia Brown", "Sarah Lourd", "Tom Nelson"
        ]
    }, {
        type: 'list',
        message: "What is name of the department?",
        name: 'name',
        choices: []
    }, {
        type: 'list',
        message: "What is the name of the role?",
        name: 'role',
        choices: []
    }, {
        type: 'list',
        message: "What is the salary  of the role?",
        name: 'salary',
        choices: []
    }, {
        type: 'list',
        message: "Which department does the role belong to?",
        name: 'belong',
        choices: ["Engineering", "Sales", "Legal", "Finance"]
    }, {
        type: 'list',
        message: "What is employee's first name?",
        name: 'first name',
        choices: []
    }, {
        type: 'list',
        message: "What is employee's last name?",
        name: 'last name',
        choices: []
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
    },
]
inquirer.prompt(questions).then((res) => {
    console.log(res)
});

// function init();
// init();