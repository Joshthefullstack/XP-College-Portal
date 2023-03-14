const db = require('./courseOfStudyDB');
const { Validator } = require('../../validator')
const validation = new Validator()

class CourseOfStudy {

    async getAllCoursesOfStudy(req, res) {
        try {
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
            const retVal = await db.getAllCoursesOfStudy();
            if (retVal == null) {
                res.status(400).json({ Error: db.getError() ? "DB Response was Null" : db.getError() });
            }
            res.status(200).send(retVal);
        } catch (error) {
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getCoursesOfStudy(req, res) {
        try {
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
            const { deptId, status, name } = req.body;
            const retVal = await db.getCoursesOfStudy(deptId, status, name);
            if (retVal == null) {
                res.status(400).json({ Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
            }
            if (retVal.length < 1) {
                return res.status(404).json({ Error: "No Course Of Studies Found" });
              }
            res.status(200).send(retVal);
        } catch (error) {
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getCourseOfStudy(req, res) {
        try {
            const courseOfStudy = await db.getCourseOfStudy(req.params.id)
            if(courseOfStudy == null){
                return res.status(400).json({
                    Error: db.getError() === null ? "DB Response Was Null" : db.getError() });
            }
            if (courseOfStudy.length < 1) {
                return res.status(404).json({ Error: "Course Of Study Not Found" });
              }
            res.json(courseOfStudy)
        } catch (error) {
            res.status(400).json({ Error: error })
            console.log(error)
        }
    }

    async createCourseOfStudy(req, res) {
        try {
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError() })
            const courseOfStudy = { ...req.body }
            const validateRes = validator(courseOfStudy);
            if (validateRes.length > 1) {
              res.status(400).json({ Error: validateRes });
            }
            const retval = await db.addCourseOfStudy(courseOfStudy)
            if (!retval) {
                return res.status(400).json({ message: db.getError() || "DB Response Was Null" })
            }
            res.status(201).json({ message: "Course Of Study Created Successfully"})
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message })
        }

    }

    async updateCourseOfStudy(req, res) {
        try {
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError() })
            const courseOfStudy = {...req.body};
            if (courseOfStudy.CourseOfStudyId == null || courseOfStudy.CourseOfStudyId == undefined || courseOfStudy.CourseOfStudyId < 1) {
                return res.status(400).json({ message: "Course Of Study Id is required" })
            }
            const validateRes = validator(courseOfStudy);
            if (validateRes.length > 1) {
              return res.status(400).json({ Error: validateRes });
            }
            const updatedCourseOfStudy = await db.editCourseOfStudy(courseOfStudy)
            if(!updatedCourseOfStudy){
                return res.status(400).json({ Error: db.getError() })
            }
            res.json({ message: "Course Of Study Updated Successfully"})
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message })
        }
    }

    async deleteCourseOfStudy(req, res) {
        try {
            const courseId = req.params.id;
            const deletedCourseOfStudy = await db.removeCourseOfStudy(courseId)
            if(deletedCourseOfStudy) res.status(200).json({ IsSuccessFul: true });
            res.status(400).json({ Error: [] })
        }
        catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

}

/**
 * 
 * @param {{
 * DepartmentId: number,
 * Name: string,
 * ShortName: string,
 * UniqueId: string,
 * Award: string,
 * Duration: number,
 * RequiredCreditUnits: number,
 * Advisor: string,
 * Status: number
 * }} CoursefStudy 
 */
const validator = (courseOfStudy) => {
    if(!validation.minlength(courseOfStudy.Name, 3, "Course Of Study Name")) return validation.getError;
    if(!validation.minimumInteger(courseOfStudy.DepartmentId, 1, "Department Id")) return validation.getError;
    if(!validation.minlength(courseOfStudy.ShortName, 4, "Course Of Study Name")) return validation.getError;
    if(!validation.minlength(courseOfStudy.UniqueId, 4, "UniqueId")) return validation.getError;
    if(!validation.minlength(courseOfStudy.Award, 3, "Award")) return validation.getError;
    if(!validation.minlength(courseOfStudy.Advisor, 3, "Advisor")) return validation.getError;
    if(!validation.minimumInteger(courseOfStudy.RequiredCreditUnits, 1, "Required Credit Units")) return validation.getError;
    if(!validation.minimumInteger(courseOfStudy.Duration, 1, "Duration")) return validation.getError;
    if(!validation.minimumInteger(courseOfStudy.Status, -1, "Status")) return validation.getError;
    return "";
  }



module.exports = new CourseOfStudy()