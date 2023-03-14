const db = require("./departmentDB");
const { Validator } = require('../../validator')
const validation = new Validator()

class Course {
  async getAllDepartments(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const retVal = await db.getAllDepartments();
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }


  async getDepartments(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const { facultyId, status, name } = req.body;
      const retVal = await db.getDepartments(facultyId, status, name);
      if (retVal == null) {
        res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
      }
      if (retVal.length < 1) {
        return res.status(404).json({ Error: "No Departments Found" });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async getDepartment(req, res) {
    try {
      const deptId = req.params.id;
      const retVal = await db.getDepartment(deptId);
      if (retVal == null) {
        return res.status(400).json({
          Error: "DB Response Was Null" 
        });
      }
      res.status(200).send(retVal);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async addDepartment(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError() })
      const department = { ...req.body };
      //Validate Api here
      const validateRes = validator(department);
      if (validateRes.length > 1) {
        res.status(400).json({ Error: validateRes });
      }
      if (!await db.addDepartment(department)) {
        return res.status(400).json({ Error: db.getError() })
      }
      res.status(200).json({ IsSuccessFul: true })
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }

  async removeDepartment(req, res) {
    try {
      const deptId = req.params.id;
      const retVal = await db.removeDepartment(deptId);
      if(retVal !== null){return res.status(200).json({ IsSuccessFul: true });}
      return res.status(400).json({ Error: {} })
    } catch (error) {
      return res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  async editDepartment(req, res) {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const department = { ...req.body };
      if (department.DepartmentId < 1) {
        return res.status(400).json({ Error: "Department Id is required" });
      }
      const validateRes = validator(department);
      if (validateRes.length > 1) {
        return res.status(400).json({ Error: validateRes });
      }
      if (!await db.editDepartment(department)) {
        return res.status(400).json({ Error: db.getError() })
      }
      res.status(200).json({ IsSuccessFul: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ Error: error })
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
const validator = (department) => {
 if(!validation.minlength(department.Name, 3, "Department Name")) return validation.getError;
 if(!validation.minimumInteger(department.FacultyId, 1, "Faculty Id")) return validation.getError;
 if(!validation.minlength(department.UniqueId, 4, "UniqueId")) return validation.getError;
 if(!validation.minlength(department.Code, 3, "Code")) return validation.getError;
 if(!validation.minimumInteger(department.Status, -1, "Status")) return validation.getError;
 return "";
}

module.exports = new Course();

// DO VALIDATION IN VALIDATE COURSE.JS FOR MAX LENGTH VAL
