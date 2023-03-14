const db = require("./facultyDB");
const { Validator } = require('../../validator')
const validation = new Validator()

class Faculty {
  getAllFaculties = async (req, res) => {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const retVal = await db.getAllFaculties();
      if (retVal == null) {
        return res.status(400).json({ Error: db.getError() ? "DB Response was Null" : db.getError() });
      }
      res.status(200).send(retVal);
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  getFaculty = async (req, res) => {
    try {
      const  facultyId  = req.params.id;
      const retVal = await db.getFaculty(facultyId);
      if (retVal.length < 1) {
        return res.status(400).json({ Error: "No faculty found" });
      } else {
        return res.status(200).send(retVal);
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  getFaculties = async (req, res) => {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const { status, name } = req.body;
      if (!status && !name) {
        return res.status(400).json({ Error: "Please input a valid query" });
      } else {
        const retVal = await db.getFaculties(name, status);
        console.log(retVal);
        if (retVal == null) {
          return res
            .status(400)
            .json({
              Error: db.getError() === null ? "No faculty found" : db.getError(),
            });
        } else {
         return res.status(200).send(retVal);
        }
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  addFaculty = async (req, res) => {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError() })
      const faculty = { ...req.body };
      if (!faculty) return res.status(400).json({ Error: "Input Faculty Data" });
      const validateRes = validator(faculty);
      if (validateRes.length > 1) {
        res.status(400).json({ Error: validateRes });
      }
      const retValue = await db.addFaculty(faculty);
      if (retValue == null) { return res.status(400).json({ Error: db.getError() ? db.getError() : "Db returned null" }); }

      return res.status(200).json({ IsSuccess: true });
    
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  editFaculty = async (req, res) => {
    try {
      if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
      const faculty = { ...req.body };
      if (faculty.FacultyId < 1) {
        return res.status(400).json({ Error: "Please input a valid faculty Id" });
      }
      const validateRes = validator(faculty);
      if (validateRes.length > 1) {
        return res.status(400).json({ Error: validateRes });
      }
      else {
        const retVal = await db.editFaculty(faculty);
        if(retVal == null){
            res.status(400).json({ Error: db.getError()})
        }
        res.status(200).json({ IsSuccessFul: true });
      }
    } catch (error) {
      res.status(400).json({ Error: error });
      console.log(error);
    }
  }

  removeFaculty = async (req, res) => {
    try {
      const facultyId  = req.params.id;
      const retVal = await db.removeFaculty(facultyId);  
      if(retVal !== null) return res.status(200).json({ IsSuccessFul: true });
      return res.status(400).json({ Error: "There are departments under this faculty" })
    } catch (error) {
      console.log(db.getError())
      console.log(error);
      return res.status(400).json({ Error: error });
    }
  }
}

  /**
   * 
   * @param {{
   * FacultyId: number,
   * Name: string,
   * UniqueId: string,
   * Code: string,
   * Status: number
   * }} faculty 
   * @returns 
   */
  const validator = (faculty) => {
    if (!faculty) return "Input Faculty Data";
    if(!validation.minlength(faculty.Name, 3, "Faculty Name")) return validation.getError;
    if(!validation.minimumInteger(faculty.DepartmentId, 4, "Unique Id")) return validation.getError;
    if(!validation.minimumInteger(faculty.Code, 3, "Faculty Code")) return validation.getError;
    if(!validation.minimumInteger(faculty.Status, -1, "Faculty Status")) return validation.getError;
    return "";
}


module.exports = new Faculty;
