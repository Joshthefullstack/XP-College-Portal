const pool = require('../../dbconfig');
let errMsg = "";


const getAllCoursesOfStudy = async () => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."CourseOfStudy" ORDER BY "Name" ASC')
    return result.rows;
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

const getCoursesOfStudy = async (deptId, status, name) => {
  try {
    let query = 'SELECT * FROM "AcadSchema"."CourseOfStudy" WHERE 1 = 1';
    let values = [];
    let index = 1;
    if (name && name.length > 0) {
      query += ` AND "Name" LIKE $${index}`;
      index++;
      values.push(`%${name}%`);
    }
    if (deptId && deptId > 0) {
      query += ` AND "DepartmentId" = $${index}`;
      index++
      values.push(deptId);
    }
    if (status && status > -1) {
      query += ` AND "Status" = $${index}`;
      values.push(status);
    }
    query += ' ORDER BY "CourseOfStudyId" ASC ';

    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      return result.rows;
    }
    return [];
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

const getCourseOfStudy = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."CourseOfStudy" WHERE "CourseOfStudyId" = $1', [id])
    if (result.rows.length > 0) {
      return result.rows[0]
    } else {
      return [];
    }
  } catch (error) {
    errMsg = error;
    return null;
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
 * }} courseOfStudy 
 * @returns {Promise<object|null>}
 */
const addCourseOfStudy = async (courseOfStudy) => {
  try {
    const values = [courseOfStudy.DepartmentId, courseOfStudy.Name, courseOfStudy.ShortName, courseOfStudy.UniqueId, courseOfStudy.Award, courseOfStudy.Duration, courseOfStudy.RequiredCreditUnits, courseOfStudy.Advisor, courseOfStudy.Status];

    const result = await pool.query('INSERT INTO "AcadSchema"."CourseOfStudy" ("DepartmentId", "Name", "ShortName", "UniqueId", "Award", "Duration", "RequiredCreditUnits", "Advisor", "Status") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', values);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

/**
 * 
 * @param {{
 * CourseOfStudyId: number,
 * DepartmentId: number,
 * Name: string,
 * ShortName: string,
 * UniqueId: string,
 * Award: string,
 * Duration: number,
 * RequiredCreditUnits: number,
 * Advisor: string,
 * Status: number
 * }} courseOfStudy 
 * @returns {Promise<object|null>}
 */
const editCourseOfStudy = async (courseOfStudy) => {
  try {
    const values = [courseOfStudy.DepartmentId, courseOfStudy.Name, courseOfStudy.ShortName, courseOfStudy.UniqueId, courseOfStudy.Award, courseOfStudy.Duration, courseOfStudy.RequiredCreditUnits, courseOfStudy.Advisor, courseOfStudy.Status, courseOfStudy.CourseOfStudyId];

    const result = await pool.query('UPDATE "AcadSchema"."CourseOfStudy" SET "DepartmentId" = $1, "Name" = $2, "ShortName" = $3, "UniqueId" = $4, "Award" = $5, "Duration" = $6, "RequiredCreditUnits" = $7, "Advisor" = $8, "Status" = $9 WHERE "CourseOfStudyId" = $10 RETURNING *', values);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    errMsg = error;
    return null;
  }
}



const removeCourseOfStudy = async (id) => {
  try {
    const result = await pool.query('DELETE FROM "AcadSchema"."CourseOfStudy" WHERE "CourseOfStudyId" = $1', [id]);
    if (result.rowCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    errMsg = error;
    return null;
  }
}


const getError = () => {
  return errMsg;
}


module.exports = {
  getAllCoursesOfStudy,
  getCoursesOfStudy,
  getCourseOfStudy,
  addCourseOfStudy,
  editCourseOfStudy,
  removeCourseOfStudy,
  getError
}