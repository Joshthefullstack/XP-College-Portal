const db = require("./lecturerDB");
const { Validator } = require('../../validator')
const validation = new Validator()

class Lecturer{
    async getAllLecturers(req, res){
        try{
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
            const retVal = await db.getAllLecturers();
            if(retVal == null){
                res.status(400).json({Error: "DB Response Was Null" });
            }
            res.status(200).send(retVal);
        } catch(error){
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }

    async getLecturers(req, res){
        try{
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
            const { departmentId, status, firstname } = req.body;
            const retVal = await db.getLecturers(departmentId, status, firstname); 
            if(retVal.length > 1){
                res.status(200).send(retVal);
            }
            res.status(400).json({
                Error: db.getError() === null ? "DB Response was Null" : db.getError() 
            });
        } catch(error){
            res.status(400).json({Error: error});
            console.log(error);
        }
    }

    async addLecturer(req, res){
        try{
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError() })
            const lecturer = { ... req.body };
            //Validate Api here
            const validateRes = validator(lecturer);
            if (validateRes.length > 1) {
              res.status(400).json({ Error: validateRes });
            }
            if(!await db.addLecturer(lecturer)){
                return res.status(400).json({ Error: db.getError() })
            } 
            res.status(200).json({ IsSuccessFul: true})
        } catch(error){
            res.status(400).json({ Error: error});
            console.log(error);
        }
    }
    //GET EACH LECTURER
    
    async getLecturer(req, res){
        try{
            const  lecturerId =  req.params.id;
            const retVal = await db.getLecturer(lecturerId);
            if(retVal.length > 1){
                res.status(200).send(retVal);
            }
            return res.status(400).json({Error: "Could not find Lecturer with this id"});
        } catch(error){
            res.status(400).json({Error: error});
            console.log(error);
        }
    }


    async removeLecturer(req, res){ 
        try{
            // Fix this delete courses
            const  lecturerId =  req.params.id;
            const retVal = await db.removeLecturer(lecturerId);
            if(!retVal){
                return res.status(400).json({ Error: "DB Response Was Null" });           
            }
            res.status(200).send(retVal);
        } catch(error){
            res.status(400).json({ Error: error });
            console.log(error);
        }
    }


    async editLecturer(req, res){
        try{
            if(!validation.isBodyValid(req.body)) res.status(400).json({ Error: validation.getError })
            const lecturer = { ... req.body };
            if(lecturer && lecturer.LecturerId < 1){
                return res.status(400).json({ Error: "Lecturer Id is required"});
            }
            const validateRes = validator(lecturer);
            if (validateRes.length > 1) {
              return res.status(400).json({ Error: validateRes });
            }
            const retVal = await db.editLecturer(lecturer);
            if(!await db.editLecturer(lecturer)){
                return res.status(400).json({ Error: db.getError() })
            }      
            res.status(200).json({ IsSuccessFul: true});
        } catch(error){
            res.status(400).json({ Error: error})
            console.log(error);
        }
    }

    }

/**
 * 
 * @param {{
    *  FirstName: string,
    * Surname: string,
    * OtherNames: string,
    * StaffId: string,
    * DepartmentId: number,
    * Status: number
 * }} lecturer 
 * @returns 
 */
const validator = (lecturer) => {
    if(!validation.minlength(lecturer.FirstName, 3, "Lecturer First Name")) return validation.getError;
    if(!validation.minlength(lecturer.Surname, 3, "Lecturer Surname")) return validation.getError;
    if(!validation.minlength(lecturer.OtherName, 3, "Lecturer Other Name")) return validation.getError;
    if(!validation.minimumInteger(lecturer.DepartmentId, 1, "Department Id")) return validation.getError;
    if(!validation.minimumInteger(lecturer.StaffId, 4, "Lecturer StaffId")) return validation.getError;
    if(!validation.minimumInteger(lecturer.Status, -1, "Status")) return validation.getError;
    return "";
   }

module.exports = new Lecturer;