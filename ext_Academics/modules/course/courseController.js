var course = require("./course");
const express = require("express");
const router = express.Router();

class CourseController {
  constructor(app) {
    // Get all courses
    router.get("/", course.getAllCourses);
    // Get courses by name, facultyId, status or all
    router.post("/", course.getCourses);
    // Get course by id
    router.get("/:id", course.getCourse);
    // Add new course
    router.post("/add", course.addCourse);
    // Update course
    router.put("/", course.editCourse);
    // Delete course
    router.delete("/:id", course.removeCourse);

    // use /api/v1/courses as base route
    // for all routes in this controller and pass
    // as middleware to app
    app.use("/api/v1/courses", router);
  }
}

module.exports = CourseController;