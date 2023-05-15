const mysql = require('mysql2');
const inquirer = require('inquirer');
require("dotenv").config()
// Connect to database
const db = process.env.JAWSDB_URL || mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: process.env.pw,
        database: 'employee_tracker'
    }
);


// Using Inquirer to prompt
inquirer.prompt([
    {
        name: "action",
        message: "What would you like to do today?",
        type: "list",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update Employee Role"]
    }
])
    .then(function (response) {
        var selectedChoice = response.action;

        switch (selectedChoice) {
            case "View All Departments":
                db.query("SELECT * FROM department", function (err, result, fields) {
                    if (err) throw err;
                    console.table(result);
                })
                break;
            case "View All Roles":
                db.query("SELECT * FROM role", function (err, result, fields) {
                    if (err) throw err;
                    console.table(result);
                })
                break;
            case "View All Employees":
                db.query("SELECT * FROM employee", function (err, result, fields) {
                    if (err) throw err;
                    console.table(result);
                })
                break;
            case "Add A Department":
                addDepartment();
                break;
            case "Add A Role":
                addRole();
                break;
            case "Add An Employee":
                newEmployee();
                break;
            case "Update Employee Role":
        }
    })

//Creating individual functions to prompt for what is to be added to the database to call in the case switch

function addDepartment() {
    //Getting the name of the new department and add it to the department table of the employee_tracker database
    inquirer.prompt([
        {
            name: "newDepartment",
            message: "What is the name of the Department you want to add?",
            type: "input"
        }
    ])
        .then(function (response) {
            var newDepartment = response.newDepartment;
            var sql = "INSERT INTO department (department_name) VALUES (" + newDepartment + ")";
            db.query(sql, function (err, result) {
                if (err) throw err;
                console.log(newDepartment + "department added!");
            })
        })
}

function addRole() {
    //Getting the list of current departments to use as the choices for the third question
    db.query("SELECT (department_name) FROM department", function (err, result, fields) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "newRole",
                message: "What is the name of the role you want to add?",
                type: "input"
            },
            {
                name: "roleSalary",
                message: "What is the yearly salary of this new role?",
                type: "number"
            },
            {
                name: "roleDepartment",
                message: "What department does this new role belong to?",
                type: "list",
                choices: [availableDepartments]
            }
        ])
            .then(function (response) {
                //Getting the name for the new role and the salary for the new role and adding it role table of the employee_tracker database
                var newRole = response.newRole;
                var newSalary = response.roleSalary;
                var roleDepartment = response.roleDepartment
                var sql = "INSERT INTO role (title, salary, department_ID) VALUES (" + newRole + "," + newSalary + "," + roleDepartment




                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(newRole + "added with the salary of" + newSalary + "into the" + roleDepartment + "Department!");
                })

            })
    })
}

function newEmployee() {
    db.query("SELECT * FROM role", function (err, result, fields) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "firstName",
                message: "What is the first name of the employee you want to add?",
                type: "input"
            },
            {
                name: "lastName",
                message: "What is the last name of the employee you want to add?",
                type: "input"
            },
            {
                name: "employeeRole",
                message: "What role is this employee filling?",
                type: "list",
                choices: [result]
            }
        ])
            .then(function (response) {
                //Getting the name for the new role and the salary for the new role and adding it role table of the employee_tracker database
                var employeeFirst = response.firstName;
                var employeeLast = response.lastName;
                var employeeRole = response.employeeRole;

                var sql = "INSERT INTO employee (first_name, last_name, role_ID) VALUES (" + employeeFirst + "," + employeeLast + "," + "," + employeeRole + ")";
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log();
                })

            })
    })
}