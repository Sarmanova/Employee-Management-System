-- it is first way to join 3 tables
SELECT  first_name,last_name,title,name,salary,manager_id, role_id
FROM department -- first table's name
INNER JOIN  role -- second table's name
ON role.department_id = department.department_id
INNER JOIN employee -- third table's name
ON employee.role_id =role.role_id
-- it is secoind way to join 3 tables 
SELECT id, first_name,last_name,title,department.name AS department,salary,manager_id, role_id
FROM department,role,employee --all 
WHERE department_id = department_id AND role_id =role_id;
-- it is third way to join 3 tables 
SELECT  employees_id,first_name,last_name,title,salary,department.name AS department,manager_id, role_id
FROM employees 
INNER JOIN  roles 
ON role_id =roles_id
INNER JOIN department
ON department_id = department_id

SELECT e.id employee_id, CONCAT(e.first_name, ' ', e.last_name) AS employees_name, roles.title, department.name AS department, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e LEFT JOIN employees m ON e.manager_id = m.id INNER JOIN roles ON (roles.id = e.role_id) 
INNER JOIN department ON (department.id = roles.department_id) ORDER BY e.id;