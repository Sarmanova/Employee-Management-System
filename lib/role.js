class Roles {
    constructor(title, salary, department) {
        this.title = title;
        this.salary = salary;
        this.department = department;
    }
    getTitle() {
        return this.title
    }
    getSalary() {
        this.salary
    }
    getDepartment() {
        return this.department
    }
}
module.exports = Roles;