INSERT INTO department (id,name)
VALUES (001,"Sales"),
 (002,"Engineering"),
 (003,"Legal"),
 (004,"Finance");

INSERT INTO roles (id,title, salary, department_id)
VALUES  (001,"Sales Lead", 100000, 4),
    (002,"Salesperson", 80000, 4),
    (003,"Lead Engineer", 150000, 1),
    (004,"Software Engineer", 120000, 1),
    (005,"Account Manager", 160000, 2),
    (006,"Accountant", 125000, 2),
    (007,"Legal Team Lead", 250000, 3),
    (008"Lawyer", 190000, 3);



INSERT INTO employees (id,first_name, last_name, role_id, manager_id)
VALUES (001,"John", "Doe", 1, NULL),
    (002,"Mike", "Chan", 2, 1),
    (003,"Ashley", "Rodriguez", 3, NULL),
    (004,"Kevin", "Tupik", 4, 3),
    (005,"Kunal", "Singh", 5, NULL),INSERT INTO employees (id,first_name, last_name, role_id, manager_id)
VALUES (009,"John", "Doe", 1, NULL)
    (006,"Malia", "Brown", 6, 5),
    (007,"Sarah", "Lourd", 7, NULL),
    (008,"Tom", "Allen", 8, 7);