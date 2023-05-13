const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'webkinz',
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
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(newDepartment + "department added!");
            })
        })
}

function addRole() {
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
        }
    ])
        .then(function (response) {
            //Getting the name for the new role and the salary for the new role and adding it role table of the employee_tracker database
            var newRole = response.newRole;
            var newSalary = response.roleSalary;
            var sql = "INSERT INTO role (department_name, salary) VALUES (" + newRole + "," + newSalary + ")";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(newRole + "added with the salary of" + newSalary);
            })

        })
}