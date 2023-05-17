-- Active: 1682537155486@@127.0.0.1@3306@employee_tracker

DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE
    department (
        ID INT NOT NULL AUTO_INCREMENT ,
        department_name VARCHAR(30) NOT NULL PRIMARY KEY
    );

CREATE TABLE
    role (
        ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_ID VARCHAR(30) NOT NULL,
        CONSTRAINT FK_department FOREIGN KEY (department_ID) REFERENCES department(department_name)
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