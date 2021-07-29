DROP DATABASE IF EXISTS corporation_db;
CREATE DATABASE corporation_db;
USE corporation_db;
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    
);
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_id INT,
    title  VARCHAR(30) NOT NULL,
    salary DECIMAL,
    FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE SET NULL 

);
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    first_name  VARCHAR (30) NOT NULL,
    last_name  VARCHAR (30) NOT NULL,
    manager_id INT,
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE SET NULL,
   
);
