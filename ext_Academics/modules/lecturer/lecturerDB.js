const pool = require('../../dbconfig');
let errMsg = "";


const getAllLecturers = async () => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Lecturer" ORDER BY "StaffId" ASC')
    return result.rows;
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

const getLecturers = async (deptId, status, firstname) => {
  try {
    let query = 'SELECT * FROM "AcadSchema"."Lecturer" WHERE 1 = 1';
    let values = [];
    let index = 1;
    if (firstname && firstname.length > 0) {
      query += ` AND ("FirstName" LIKE $${index})`;
      index++;
      values.push(`%${firstname}%`);
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
    query += ' ORDER BY "StaffId" ASC ';
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

const getLecturer = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM "AcadSchema"."Lecturer" WHERE "LecturerId" = $1', [id])
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

const addLecturer = async (lecturer) => {
  try {
    const values = [lecturer.FirstName, lecturer.Surname, lecturer.OtherName, lecturer.StaffId, lecturer.DepartmentId, lecturer.Status];

    const result = await pool.query('INSERT INTO "AcadSchema"."Lecturer" ("FirstName", "Surname", "OtherName", "StaffId", "DepartmentId", "Status") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', values);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    // return [];
  } catch (error) {
    console.log(error);
    errMsg = error;
    return null;
  }
}

const editLecturer = async (lecturer) => {
  try {
    const values = [lecturer.FirstName, lecturer.Surname, lecturer.OtherName, lecturer.StaffId, lecturer.DepartmentId, lecturer.Status, lecturer.LecturerId];

    const result = await pool.query('UPDATE "AcadSchema"."Lecturer" SET "FirstName" = $1, "Surname" = $2, "OtherName" = $3, "StaffId" = $4, "DepartmentId" = $5, "Status" = $6 WHERE "LecturerId" = $7 RETURNING *', values);

    if (result.rows.length > 0) {
      return result.rows[0];
    }
    // return [];
  } catch (error) {
    errMsg = error;
    return null;
  }
}

const removeLecturer = async (id) => {
  try {
    const result = await pool.query('DELETE FROM "AcadSchema"."Lecturer" WHERE "LecturerId" = $1', [id]);
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
  getAllLecturers,
  getLecturers,
  getLecturer,
  addLecturer,
  editLecturer,
  removeLecturer,
  getError
}