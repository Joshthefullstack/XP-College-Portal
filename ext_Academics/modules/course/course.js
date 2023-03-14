const db = require("./courseDB");
const { Validator } = require('../../validator')
const validation = new Validator()

class Course {
  /**
   * 
   * @param {*} req 
   * @param {*} res 
   * @returns jnoih
   */
  async getAllCourses(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const retVal = await db.getAllCourses();
      if (retVal == null) {
        return res.status(400).json({ Error: db.getError() ? "DB Response was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async getCourses(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const { deptId, status, name } = req.body;
      const retVal = await db.getCourses(deptId, status, name);
      if (retVal == null) {
        return res.status(400).json({ Error: db.getError() == null ? "DB Response Was Null" : db.getError() });
      }
      if (retVal.length < 1) {
        return res.status(404).json({ Error: "No Courses Found" });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error)
    }
  }

  async getCourse(req, res) {
    try {
      const courseId = req.params.id;
      const retVal = await db.getCourse(courseId);
      
      if (retVal ==null) {
        res.status(400).json({
          Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      if (retVal.length < 1) {
        res.status(404).json({ Error: "Course Not Found" });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async addCourse(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError() })
      const course = { ...req.body };
      //Validate Api here
      const validateRes = validator(course);
      if (validateRes.length > 1) {
        res.status(400).json({ Error: validateRes });
      }
      if (!await db.addCourse(course)) {
        return res.status(400).json({ Error: db.getError() })
      }
      res.status(200).json({ IsSuccessFul: true })
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async editCourse(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const course = { ...req.body };
      if (course.CourseId < 1) {
        return res.status(400).json({ Error: "Course Id is required" });
      }
      const validateRes = validator(course);
      if (validateRes.length > 1) {
        return res.status(400).json({ Error: validateRes });
      }
      if (!await db.editCourse(course)) {
        return res.status(400).json({ Error: db.getError() })
      }
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error })
    }
  }

  async removeCourse(req, res) {
    try {
      const courseId = req.params.id;
      const retVal = await db.removeCourse(courseId);
      if(retVal.length > 0) res.status(200).json({ IsSuccessFul: true });
      res.status(400).json({ retVal })
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

}

/**
 * Validates the course object passes in to the api
 * @param {{
 * Name: string,
 * DepartmentId: number,
 * UniqueId: string,
 * Code: string,
 * Units: number,
 * CourseLevel: number,
 * CourseSemester: number,
 * Status: number
 * }} course
 * @returns {string} Returns an empty string if the course object is valid else returns an error message
 */
const validator = (course) => {
  if(!validation.minlength(course.Name, 3, "Course Name")) return validation.getError;
  if(!validation.minimumInteger(course.DepartmentId, 1, "Department Id")) return validation.getError;
  if(!validation.minlength(course.UniqueId, 4, "UniqueId")) return validation.getError;
  if(!validation.minlength(course.Code, 3, "Code")) return validation.getError;
  if(!validation.minimumInteger(course.Units, 1, "Units")) return validation.getError;
  if(!validation.minimumInteger(course.CourseLevel, 1, "Course Level")) return validation.getError;
  if(!validation.minimumInteger(course.CourseSemester, 1, "Course Semester")) return validation.getError;
  if(!validation.minimumInteger(course.Status, -1, "Status")) return validation.getError;
  return "";
}


module.exports = new Course;