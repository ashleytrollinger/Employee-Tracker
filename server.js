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
                    db.query("SELECT role.*, employee.first_name, employee.last_name FROM role JOIN employee ON role.employee_id = employee.id", function (err, result, fields) {
                        if (err) throw err;
                        console.table(result);
                        prompt();
                    });
                    break;

                case "View All Employees":
                    db.query("SELECT employee.*, role.title FROM employee JOIN role ON employee.role_id = role.id", function (err, result, fields) {
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

function addRole() {
    //Getting the list of current departments to use as the choices for the third question
    db.query("SELECT (department_name) FROM department", function (err, result, fields) {
        if (err) throw err;
        const availableDepartments = results.map(department => department.department_name);
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
                choices: availableDepartments
            }
        ])
            .then(function (response) {
                //Getting the name for the new role and the salary for the new role and adding it role table of the employee_tracker database
                var newRole = response.newRole;
                var newSalary = response.roleSalary;
                var roleDepartment = response.roleDepartment;
                var sql = `INSERT INTO role (title, salary, department_ID) VALUES ('${newRole}', ${newSalary}, (SELECT ID FROM department WHERE department_name = '${roleDepartment}'))`;



                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(`${newRole} added with a salary of ${newSalary} into the ${roleDepartment} department!`);
                    prompt();
                })

            })
    })
}

function newEmployee() {
    db.query("SELECT * FROM role", function (err, result, fields) {
        if (err) throw err;
        const roleChoices = result.map(role => role.title);
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
            }
        ])
            .then(function (response) {
                // Getting the name for the new role and the salary for the new role and adding it to the role table of the employee_tracker database
                var employeeFirst = response.firstName;
                var employeeLast = response.lastName;
                var employeeRole = response.employeeRole;

                db.query("SELECT * FROM employee", function (err, results, fields) {
                    inquirer.prompt([
                        {
                            name: "employeeManager",
                            message: "Who is this employee's manager (if they have one)?",
                            type: "list",
                            choices: results.map(employee => employee.first_name)
                        }
                    ])
                        .then(function (response1) {
                            var employeeManager = response1.employeeManager;
                            // Retrieve the role ID based on the selected role title
                            const selectedRole = result.find(role => role.title === employeeRole);
                            var roleID = selectedRole.ID;

                            var sql = `INSERT INTO employee (first_name, last_name, role_ID, manager) VALUES ('${employeeFirst}', '${employeeLast}', ${roleID}, '${employeeManager}')`;

                            db.query(sql, function (err, result) {
                                if (err) throw err;
                                console.log(`Employee ${employeeFirst} ${employeeLast} in the role ${employeeRole} added successfully!`);
                                prompt();
                            });
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

        inquirer.prompt([
            {
                name: "employeeID",
                message: "Select the employee you want to update:",
                type: "list",
                choices: employeeChoices
            },
            {
                name: "newRole",
                message: "Enter the new role for the employee:",
                type: "input"
            }
        ])
            .then(function (response) {
                // Getting the selected employee ID and the new role from the user's response
                var employeeID = response.employeeID;
                var newRole = response.newRole;

                var sql = `UPDATE employee SET role_name = '${newRole}' WHERE ID = ${employeeID}`;

                db.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(`Successfully updated the role of employee with ID ${employeeID} to "${newRole}"`);
                    prompt();
                });
            });
    });
}

