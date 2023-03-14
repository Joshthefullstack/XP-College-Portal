var department = require("./department");
const express = require("express");
const router = express.Router();

class DepartmentController {
  constructor(app) {
    // Get all departments
    router.get("/", department.getAllDepartments);
    // Get departments by name, facultyId, status or all
    router.post("/", department.getDepartments);
    // Get department by id
    router.get("/:id", department.getDepartment);
    // Add new department
    router.post("/add", department.addDepartment);
    // Update department
    router.put("/", department.editDepartment);
    // Delete department
    router.delete("/:id", department.removeDepartment);

    // use /api/v1/departments as base route
    // for all routes in this controller and pass
    // as middleware to app
    app.use("/api/v1/departments", router);
  }
}

module.exports = DepartmentController;