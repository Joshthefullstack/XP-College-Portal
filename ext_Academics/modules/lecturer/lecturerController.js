var lecturer = require("./lecturer");
const express = require("express");
const router = express.Router();

class LecturerController {
  constructor(app) {
    router.get("/", lecturer.getAllLecturers);
    router.post("/", lecturer.getLecturers);
    router.post("/add", lecturer.addLecturer);
    router.delete("/:id", lecturer.removeLecturer);
    router.put("/", lecturer.editLecturer);
    router.get("/:id", lecturer.getLecturer);
    app.use("/api/v1/lecturers", router);
  }
}

module.exports = LecturerController;