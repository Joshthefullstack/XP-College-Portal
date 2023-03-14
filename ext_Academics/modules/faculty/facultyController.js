var faculty = require("./faculty");
const express = require("express");
const router = express.Router();

class FacultyController {
  constructor(app) {
    // Get all faculties
    router.get("/", faculty.getAllFaculties);
    // Get faculties by name, status or all
    router.post("/", faculty.getFaculties);
    // Get faculty by id
    router.get("/:id", faculty.getFaculty);
    // Add new faculty
    router.post("/add", faculty.addFaculty);
    // Update faculty
    router.put("/", faculty.editFaculty);
    // Delete faculty
    router.delete("/:id", faculty.removeFaculty);

    // use /api/v1/faculties as base route
    // for all routes in this controller and pass
    // as middleware to app
    app.use("/api/v1/faculties", router);
  }
}

module.exports = FacultyController;
