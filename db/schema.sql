DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE
    department (
        ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(30) NOT NULL
    );

CREATE TABLE
    role (
        ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_ID INT NOT NULL,
        CONSTRAINT FK_department FOREIGN KEY (department_ID) REFERENCES department(ID)
    );

CREATE TABLE
    employee (
        ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_ID INT NOT NULL,
        manager VARCHAR(30),
        CONSTRAINT FK_role FOREIGN KEY (role_ID) REFERENCES role(ID),
        CONSTRAINT FK_manager FOREIGN KEY (manager) REFERENCES employee(ID)
    );

SELECT * FROM role;