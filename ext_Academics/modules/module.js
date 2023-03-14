class Module {
  constructor(app) {
    this.app = app;
  }
  init() {
    const courseController = require("./course/courseController");
    new courseController(this.app);
    const lecturerController = require("./lecturer/lecturerController");
    new lecturerController(this.app);
    const facultyController = require('./faculty/facultyController')
    new facultyController(this.app);
    const departmentController = require('./department/departmentController')
    new departmentController(this.app);
    const courseOfStudyController = require('./courseOfStudy/courseOfStudyController')
    new courseOfStudyController(this.app);
  }
}

module.exports = Module;