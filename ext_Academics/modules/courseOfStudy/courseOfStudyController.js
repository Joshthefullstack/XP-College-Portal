const courseOfStudy = require("./courseOfStudy");
const router = require("express").Router();

class CourseOfStudyController {
  constructor(app) {
    // Get all courses of study
    router.get("/", courseOfStudy.getAllCoursesOfStudy);
    // Get courses of study by name, facultyId, status or all
    router.post("/", courseOfStudy.getCoursesOfStudy);
    // Get course of study by id
    router.get("/:id", courseOfStudy.getCourseOfStudy);
    // Add new course of study
    router.post("/add", courseOfStudy.createCourseOfStudy);
    // Update course of study
    router.put("/", courseOfStudy.updateCourseOfStudy);
    // Delete course of study
    router.delete("/:id", courseOfStudy.deleteCourseOfStudy);

    // use /api/v1/coursesOfStudy as base route 
    // for all routes in this controller and pass 
    // as middleware to app
    app.use("/api/v1/coursesOfStudy", router);
  }
}

module.exports = CourseOfStudyController;