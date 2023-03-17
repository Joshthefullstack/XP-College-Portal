// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let departmentArray;

const renderData = async () => {
  let uri = "http://localhost:8097/api/v1/courses";

  const data = await fetch(uri);
  realData = await data.json();

  const departmentSelect = document.getElementById("departmentId");
  const departmentSelect_Edit = document.getElementById("departmentId_edit");
  const departmentSelect_Search = document.getElementById("Faculty_Search");
  const department = await fetch("http://localhost:8097/api/v1/departments");
  departmentArray = await department.json();

  const tbody = document.getElementById("tbody");
  
  let startCode = '<option value="0">-- Please select a department --</option>'

  const selectOption = departmentArray.map((item, index)=>{
    return  `<option value="${item.DepartmentId}">${item.Name}</option>`;
  })
  departmentSelect.innerHTML = startCode + selectOption.join("");
  departmentSelect_Edit.innerHTML = startCode + selectOption.join("");
  departmentSelect_Search.innerHTML = startCode + selectOption.join("");


  let status = "";

  realData.forEach((course, index) => {
    const row = tbody.insertRow();

    course.Status > 0 ? status = "Active" : status = "Inactive";

    const filteredDepartment = departmentArray.filter((department, index)=>{
        if(course.DepartmentId == department.DepartmentId){
            return true;
        }
    })

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${filteredDepartment.map(item => {return item.Name})}</td>
            <td>${course.Name}</td>
            <td>${course.UniqueId}</td>
            <td class=${
              status == "Active" ? "text-success" : "text-danger"
            }>${status}</td>
            <td>
                <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
                data-bs-target="#editModal">Edit</button>
                <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteCourse(${
                  course.CourseId
                })>Delete</button>
                <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
                data-bs-target="#detailModal" onclick=courseDetails(${
                  course.CourseId
                })>Details</button>
            </td>
        `;
  });

};

// DELETING FACULTIES
const deleteCourse = async (id) => {
  const responses = await fetch(
    "http://localhost:8097/api/v1/courses/" + id,
    {
      method: "DELETE",
    }
  );
    
    location.reload();
  
};

// FORM HANDLING
const addForm = document.getElementById("addFaculty");

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox");
  const errorMsg = document.getElementById("error_msg");


  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const newCourse = {
    DepartmentId: addForm.department.value,
    Name: addForm.Name.value,
    UniqueId: addForm.UniqueId.value,
    Units: addForm.Units.value,
    Code: addForm.Code.value,
    CourseLevel: addForm.CourseLevel.value,
    CourseSemester: addForm.CourseSemester.value,
    Status: statusCheckbox.value,
  };

  // check for errors in the form
  if (newCourse.DepartmentId == 0) {
    errorMsg.innerHTML = "Please enter a valid Department id";
    return false;
  }
  if (newCourse.Name.length < 3 || newCourse.Name.length == "") {
    errorMsg.innerHTML = "Please enter a valid course name";
    return false;
  }
  if (newCourse.UniqueId.length < 3 || newCourse.UniqueId.length == "") {
    errorMsg.innerHTML = "Please enter a valid course unique id";
    return false;
  }
  if (newCourse.Units < 1) {
    errorMsg.innerHTML = "Please enter a valid course units";
    return false;
  }
  if (newCourse.Code.length < 3 || newCourse.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid course code";
    return false;
  }
  if (newCourse.CourseLevel < 1) {
    errorMsg.innerHTML = "Please enter a valid course level";
    return false;
  }
  if (newCourse.CourseSemester < 1) {
    errorMsg.innerHTML = "Please enter a valid course semester";
    return false;
  }


  await fetch("http://localhost:8097/api/v1/courses/add", {
    method: "POST",
    body: JSON.stringify(newCourse),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// EDITING FACULTIES
const editForm = document.getElementById("editCourse");

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_edit");
  const errorMsg = document.getElementById("error_msg_edit");

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const editCourse = {
    CourseId: editForm.CourseId.value,
    DepartmentId: editForm.department.value,
    Name: editForm.Name.value,
    UniqueId: editForm.UniqueId.value,
    Units: editForm.Units.value,
    Code: editForm.Code.value,
    CourseLevel: editForm.CourseLevel.value,
    CourseSemester: editForm.CourseSemester.value,
    Status: statusCheckbox.value,
  };

  if (editCourse.DepartmentId == 0) {
    errorMsg.innerHTML = "Please enter a valid Department id";
    return false;
  }
  if (editCourse.Name.length < 3 || editCourse.Name.length == "") {
    errorMsg.innerHTML = "Please enter a valid course name";
    return false;
  }
  if (editCourse.UniqueId.length < 3 || editCourse.UniqueId.length == "") {
    errorMsg.innerHTML = "Please enter a valid course unique id";
    return false;
  }
  if (editCourse.Units < 1) {
    errorMsg.innerHTML = "Please enter a valid course units";
    return false;
  }
  if (editCourse.Code.length < 3 || editCourse.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid course code";
    return false;
  }
  if (editCourse.CourseLevel < 1) {
    errorMsg.innerHTML = "Please enter a valid course level";
    return false;
  }
  if (editCourse.CourseSemester < 1) {
    errorMsg.innerHTML = "Please enter a valid course semester";
    return false;
  }

  await fetch("http://localhost:8097/api/v1/courses", {
    method: "PUT",
    body: JSON.stringify(editCourse),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
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
    deptId: searchCourse.department.value,
    name: searchCourse.Name.value,
    status: statusCheckbox.value,
  }

  const response = await fetch('http://localhost:8097/api/v1/courses', {
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
      const row = tableBody.insertRow();

      item.Status > 0 ? status = "Active" : status = "Inactive";

      const filteredFaculty = departmentArray.filter((faculty, index)=>{
        if(item.DepartmentId == faculty.DepartmentId){
            return true;
        }
    })

      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${filteredFaculty.map(item => {return item.Name})}</td>
      <td>${item.Name}</td>
      <td>${item.UniqueId}</td>
      <td class=${
        status == "Active" ? "text-success" : "text-danger"
      }>${status}</td>
      <td>
          <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
          data-bs-target="#editModal">Edit</button>
          <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteCourse(${
            item.CourseId
          })>Delete</button>
          <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
          data-bs-target="#detailModal" onclick=courseDetails(${
            item.CourseId
          })>Details</button>
      </td>
      `
    })
  }
  
});

const clearSearchBtn = document.getElementById("clear_search_btn");

clearSearchBtn.addEventListener("click", ()=>{
  location.reload();
})

const courseDetails = async (id) => {
  const response = await fetch('http://localhost:8097/api/v1/courses/' + id, {
    method: "GET"
  })

  let eachCOS = await response.json();
  let cosArray = [];
  cosArray.push(eachCOS);

  let status = "";

  cosArray.forEach((item, index)=>{

    item.Status > 0 ? status = "Active" : status = "Inactive";

    const filteredDepartment = departmentArray.filter((department, index)=>{
      if(item.DepartmentId == department.DepartmentId){
          return true;
      }
  })

    document.getElementById("courseDepartment").innerHTML = `Course Department: ${filteredDepartment.map(item => {return item.Name})}`;
    document.getElementById("courseName").innerHTML = `Course  Name: ${item.Name}`;
    document.getElementById("courseUniqueId").innerHTML = `Course Unique Id: ${item.UniqueId}`;
    document.getElementById("courseUnits").innerHTML = `Course Units: ${item.Units}`;
    document.getElementById("courseCode").innerHTML = `Course Code: ${item.Code}`;
    document.getElementById("courseLevel").innerHTML = `Course Level: ${item.CourseLevel}`;
    document.getElementById("courseSemester").innerHTML = `Course Semester: ${item.CourseSemester}`;
    document.getElementById("courseStatus").innerHTML = `Course Status: ${status}`;

  })
   
}