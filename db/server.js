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
            case "Add A Role":

            case "Add An Employee":

            case "Update Employee Role":
        }
    })
//Creating individual functions to prompt for what is to be added to the database to call in the case switch
function addDepartment() {
    inquirer.prompt([
        {
            name: "newDepartment",
            message: "What is the name of the Department you want to add?",
            type: "input"
        }
    ])
        .then(function (response) {
            var newDepartment = response.newDepartment;
            var sql = "INSERT INTO department VALUES (" + newDepartment + ")";
            con.query(sql, function (err, result) {
                if (err) throw err;
            })
        })
}
