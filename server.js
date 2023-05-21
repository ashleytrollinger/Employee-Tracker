const mysql = require('mysql2');
const inquirer = require('inquirer');
const { default: ExpandPrompt } = require('inquirer/lib/prompts/expand');
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
prompt();
function prompt() {
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
                        prompt();
                    })
                    break;
                case "View All Roles":
                    db.query("SELECT role.title, role.salary, department.department_name AS department FROM role JOIN department ON role.department_id = department.id", function (err, result, fields) {
                        if (err) throw err;
                        console.table(result);
                        prompt();
                    });
                    break;
                case "View All Employees":
                    db.query("SELECT employee.first_name, employee.last_name, role.title AS role, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee employee LEFT JOIN role role ON employee.role_id = role.id LEFT JOIN employee m ON employee.manager = m.id", function (err, result, fields) {
                        if (err) throw err;
                        console.table(result);
                        prompt();
                    });
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
                    updateEmployeeRole();
            }
        })
};
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
            var sql = "INSERT INTO department (department_name) VALUES ('" + newDepartment + "')";
            db.query(sql, function (err, result) {
                if (err) throw err;
                console.log(newDepartment + "department added!");
                prompt();
            })
        })
}

function newEmployee() {
    db.query("SELECT * FROM role", function (err, result, fields) {
        if (err) throw err;
        const roleChoices = result.map(role => role.title);
        db.query("SELECT * FROM employee", function (err, results, fields) {
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
                    choices: roleChoices
                },
                {
                    name: "employeeManager",
                    message: "Who is this employee's manager (if they have one)?",
                    type: "list",
                    choices: function () {
                        const managerChoices = results.map(employee => employee.first_name);
                        managerChoices.unshift("No Manager");
                        return managerChoices;
                    }
                }
            ])
                .then(function (response) {
                    const employeeFirst = response.firstName;
                    const employeeLast = response.lastName;
                    const employeeRole = response.employeeRole;
                    const employeeManager = response.employeeManager === "No Manager" ? null : response.employeeManager;

                    const selectedRole = result.find(role => role.title === employeeRole);
                    const roleID = selectedRole.ID;

                    const sql = `INSERT INTO employee (first_name, last_name, role_ID, manager) VALUES (?, ?, ?, ?)`;
                    const values = [employeeFirst, employeeLast, roleID, employeeManager];

                    db.query(sql, values, function (err, result) {
                        if (err) throw err;
                        console.log(`Employee ${employeeFirst} ${employeeLast} in the role ${employeeRole} added successfully!`);
                        prompt();
                    });
                });
        });
    });
}



function updateEmployeeRole() {
    // Getting the list of current employees to use as the choices for the first question
    const sql = `SELECT employee.ID, employee.first_name, employee.last_name, role.title
            FROM employee
            INNER JOIN role ON employee.role_ID = role.ID`;
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        const employeeChoices = result.map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.ID
            };
        });

        // Fetching the list of existing roles for the role choices
        const roleSql = "SELECT * FROM role";
        db.query(roleSql, function (err, roleResult) {
            if (err) throw err;

            const roleChoices = roleResult.map(role => {
                return {
                    name: role.title,
                    value: role.ID
                };
            });

            inquirer.prompt([
                {
                    name: "employeeID",
                    message: "Select the employee you want to update:",
                    type: "list",
                    choices: employeeChoices
                },
                {
                    name: "newRole",
                    message: "Select the new role for the employee:",
                    type: "list",
                    choices: roleChoices
                }
            ])
                .then(function (response) {
                    // Getting the selected employee ID and the new role from the user's response
                    var employeeID = response.employeeID;
                    var newRoleID = response.newRole;

                    var sql = `UPDATE employee SET role_ID = ${newRoleID} WHERE ID = ${employeeID}`;

                    db.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(`Successfully updated the role of employee with ID ${employeeID}`);
                        prompt();
                    });
                });
        });
    });
}
