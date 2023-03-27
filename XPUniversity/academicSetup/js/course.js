// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let departmentArray;
let realData;
let courseId;
let show;
const tbody = document.getElementById("tbody");
const errorMsg = document.getElementById("error_msg");
const addForm = document.getElementById("addFaculty");
let UNITS = [2, 3, 4, 5];
let COURSE_LEVEL = [100, 200, 300, 400, 500, 600, 700];
let COURSE_SEMESTER = [1, 2];
const validate = new validator();
let apiEndpoint = "http://192.168.17.220:8097/api/v1/courses";

const renderData = async () => {
  validate.populatePage()

  let uri = apiEndpoint;

  const data = await fetch(uri);
  realData = await data.json();

  const department = await fetch("http://192.168.17.220:8097/api/v1/departments");
  departmentArray = await department.json();

  populateDropDown()
  
  let status = "";

  realData.forEach((course, index) => {
      renderTable(course, index, status)
  });

};

const populateDropDown = () => {
  const departmentSelect = document.getElementById("departmentId");
  const departmentSelect_Search = document.getElementById("Faculty_Search");
  let startCode = '<option value="0">-- Please select a department --</option>'
  const selectOption = departmentArray.map(item=>{ return  `<option value="${item.DepartmentId}">${item.Name}</option>`; })
  departmentSelect.innerHTML = startCode + selectOption.join("");
  departmentSelect_Search.innerHTML = startCode + selectOption.join("");

  let initialCode = '<option value="0">-- Please select Course Units --</option>';
  const select = UNITS.map(item => { return `<option value="${item}">${item}</option> ` });
  document.getElementById("courseUnits").innerHTML = initialCode + select.join("");

  let finalCode = '<option value="0">-- Please select Course Level --</option>';
  const level = COURSE_LEVEL.map(item => { return `<option value="${item}">${item}</option>`});
  document.getElementById("courseLevel").innerHTML = finalCode + level.join("");

  let stringLit = '<option value="0">-- Please select Course Semester --</option>';
  const semester = COURSE_SEMESTER.map(item => { return `<option value="${item}">${item}</option>` });
  document.getElementById("courseSemester").innerHTML = stringLit + semester.join("");
}


const editCourse = async (id) => {
  show - false;
  document.getElementById("exampleModalLabel").innerHTML = "Edit Course Of Study";
  const course = realData.find((course) => course.CourseId === id);
  courseId = course.CourseId;
  addForm.department.value = course.DepartmentId;
  addForm.Name.value = course.Name;
  addForm.UniqueId.value = course.UniqueId;
  addForm.Units.value = course.Units;
  addForm.Code.value = course.Code;
  addForm.CourseLevel.value = course.CourseLevel;
  addForm.CourseSemester.value = course.CourseSemester;
};

document.getElementById("addBtn").addEventListener("click", () => {
  document.getElementById("exampleModalLabel").innerHTML = "Add Course Of Study";
  show = true;
  errorMsg.innerHTML = ""
  addForm.department.value = 0;
  addForm.Name.value = "";
  addForm.UniqueId.value = "";
  addForm.Units.value = 0;
  addForm.Code.value = "";
  addForm.CourseLevel.value = 0;
  addForm.CourseSemester.value = 0;
});

// DELETING FACULTIES
const deleteCourse = async (id) => {
  const responses = await fetch(
    apiEndpoint + "/" + id,
    {
      method: "DELETE",
    }
  );
    
    location.reload();
  
};

const createCourses = async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const newCourse = {
    DepartmentId: Number(addForm.department.value),
    Name: addForm.Name.value,
    UniqueId: addForm.UniqueId.value,
    Units: Number(addForm.Units.value),
    Code: addForm.Code.value,
    CourseLevel: Number(addForm.CourseLevel.value),
    CourseSemester: Number(addForm.CourseSemester.value),
    Status: Number(statusCheckbox.value),
  };

  // check for errors in the form
  const validateInput = validation(newCourse);
  if(!validateInput){return false}
  
  await fetch(apiEndpoint + "/add", {
    method: "POST",
    body: JSON.stringify(newCourse),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
}

const updateCourses = async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const editCourse = {
    CourseId: courseId,
    DepartmentId: Number(addForm.department.value),
    Name: addForm.Name.value,
    UniqueId: addForm.UniqueId.value,
    Units: Number(addForm.Units.value),
    Code: addForm.Code.value,
    CourseLevel: Number(addForm.CourseLevel.value),
    CourseSemester: Number(addForm.CourseSemester.value),
    Status: Number(statusCheckbox.value),
  };

    // check for errors in the form
    const validateInput = validation(editCourse);
    if(!validateInput){return false}

  await fetch(apiEndpoint, {
    method: "PUT",
    body: JSON.stringify(editCourse),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
}

// FORM HANDLING
addForm.addEventListener("submit", async (e) => {
  show ? createCourses(e) : updateCourses(e);
});

// SEARCHING THROUGH FACULTIES
const searchCourse = document.getElementById("searchcourse");

searchCourse.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const errorMsg = document.getElementById("error_msg_search")
  const table = document.getElementById("table");
  let tableBody = table.lastElementChild;
  tableBody.innerHTML = "";

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const search = {
    DepartmentId: Number(searchCourse.department.value),
    Name: searchCourse.Name.value,
    Status: Number(statusCheckbox.value),
  }

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(search)
  });

  if(response.status == 400){
    document.getElementById("error").innerHTML = "This course does not exist";
  }

  if(response.status == 200){
    document.getElementById("error").innerHTML = "";
    errorMsg.innerHTML = "";
    const searchData = await response.json();

    let status = "";

    searchData.forEach((item, index)=>{
        renderTable(item, index, status)
    })
  }
  
});

const renderTable = (course, index, status) => {
  const row = tbody.insertRow();
  course.Status > 0 ? status = "Active" : status = "Inactive";
  const filteredDepartment = departmentArray.find((department) => department.DepartmentId === course.DepartmentId);
  row.innerHTML = `
          <td>${index + 1}</td>
          <td>${filteredDepartment.Name}</td>
          <td>${course.Name}</td>
          <td>${course.UniqueId}</td>
          <td class=${
            status == "Active" ? "text-success" : "text-danger"
          }>${status}</td>
          <td>
              <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#exampleModal" onclick=editCourse(${course.CourseId})>Edit</button>
              <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteCourse(${
                course.CourseId
              })>Delete</button>
              <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#detailModal" onclick=courseDetails(${
                course.CourseId
              })>Details</button>
          </td>
      `;
}

const clearSearchBtn = document.getElementById("clear_search_btn");

clearSearchBtn.addEventListener("click", ()=>{
  location.reload();
  searchCourse.Name.value = ""
})

const courseDetails = async (id) => {
  const response = await fetch(apiEndpoint + "/" + id, {
    method: "GET"
  })

  let eachCOS = await response.json();
  let cosArray = [];
  cosArray.push(eachCOS);

  let status = "";

  cosArray.forEach((item, index)=>{
    item.Status > 0 ? status = "Active" : status = "Inactive";
    const filteredDepartment = departmentArray.find((department) => department.DepartmentId === item.DepartmentId);
    document.getElementById("courseDepartment").innerHTML = `Course Department: ${filteredDepartment.Name}`;
    document.getElementById("courseName").innerHTML = `Course  Name: ${item.Name}`;
    document.getElementById("courseUniqueId").innerHTML = `Course Unique Id: ${item.UniqueId}`;
    document.getElementById("CourseUnits").innerHTML = `Course Units: ${item.Units}`;
    document.getElementById("courseCode").innerHTML = `Course Code: ${item.Code}`;
    document.getElementById("CourseLevel").innerHTML = `Course Level: ${item.CourseLevel}`;
    document.getElementById("CourseSemester").innerHTML = `Course Semester: ${item.CourseSemester}`;
    document.getElementById("courseStatus").innerHTML = `Course Status: ${status}`;

  })
   
}

// VALIDATION SYSTEM
const validation = (courseDetails) => {
  if (!validate.minimumInteger(courseDetails.DepartmentId, 1, "Department Id")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseDetails.Name, 3, "Course Name")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseDetails.UniqueId, 3, "Course Unique Id")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseDetails.Code, 3, "Course Code")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minimumInteger(courseDetails.Units, 1, "Course Units")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minimumInteger(courseDetails.CourseLevel, 1, "Course Level")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minimumInteger(courseDetails.CourseSemester, 1, "Course Semester")) { errorMsg.innerHTML = validate.getError(); return false;}
  return true;
}