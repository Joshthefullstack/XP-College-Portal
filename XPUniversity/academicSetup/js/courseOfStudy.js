// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let departmentArray;

const renderData = async () => {
  let uri = "http://localhost:8097/api/v1/coursesOfStudy";

  const data = await fetch(uri);
  realData = await data.json();

  const departmentSelect = document.getElementById("departmentId");
  const departmentSelect_Edit = document.getElementById("Faculty_Edit");
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

  realData.forEach((courseOfStudy, index) => {
    const row = tbody.insertRow();

    courseOfStudy.Status > 0 ? status = "Active" : status = "Inactive";

    const filteredDepartment = departmentArray.filter((department, index)=>{
        if(courseOfStudy.DepartmentId == department.DepartmentId){
            return true;
        }
    })

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${filteredDepartment.map(item => {return item.Name})}</td>
            <td>${courseOfStudy.Name}</td>
            <td>${courseOfStudy.UniqueId}</td>
            <td class=${
              status == "Active" ? "text-success" : "text-danger"
            }>${status}</td>
            <td>
                <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
                data-bs-target="#editModal">Edit</button>
                <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteCourseOfStudy(${
                  courseOfStudy.CourseOfStudyId
                })>Delete</button>
                <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
                data-bs-target="#detailModal" onclick=courseOfStudyDetails(${
                  courseOfStudy.CourseOfStudyId
                })>Details</button>
            </td>
        `;
  });

};

// DELETING FACULTIES
const deleteCourseOfStudy = async (id) => {
  const responses = await fetch(
    "http://localhost:8097/api/v1/coursesOfStudy/" + id,
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

  const newCourseOfStudy = {
    DepartmentId: addForm.department.value,
    Name: addForm.Name.value,
    ShortName: addForm.ShortName.value,
    UniqueId: addForm.UniqueId.value,
    Award: addForm.Award.value,
    Duration: addForm.Duration.value,
    RequiredCreditUnits: addForm.RequiredCreditUnits.value,
    Advisor: addForm.Advisor.value,
    UniqueId: addForm.UniqueId.value,
    Status: statusCheckbox.value,
  };

  // check for errors in the form
  if (newCourseOfStudy.DepartmentId == 0) {
    errorMsg.innerHTML = "Please enter a valid Department id";
    return false;
  }
  if (newCourseOfStudy.Name.length < 3 || newCourseOfStudy.Name.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy name";
    return false;
  }
  if (newCourseOfStudy.ShortName.length < 3 || newCourseOfStudy.ShortName.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy code";
    return false;
  }
  if (newCourseOfStudy.Award.length < 3 || newCourseOfStudy.Award.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy award";
    return false;
  }
  if (newCourseOfStudy.Duration < 0) {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy duration";
    return false;
  }
  if (newCourseOfStudy.RequiredCreditUnits < 0) {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy required credit units";
    return false;
  }
  if (newCourseOfStudy.Advisor.length < 3 || newCourseOfStudy.Advisor.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy advisor";
    return false;
  }
  if (newCourseOfStudy.UniqueId.length < 3 || newCourseOfStudy.UniqueId.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy unique id";
    return false;
  }

  await fetch("http://localhost:8097/api/v1/coursesOfStudy/add", {
    method: "POST",
    body: JSON.stringify(newCourseOfStudy),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// EDITING FACULTIES
const editForm = document.getElementById("editDepartment");

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_edit");
  const errorMsg = document.getElementById("error_msg_edit");

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const editCourseOfStudy = {
    CourseOfStudyId: editForm.courseOfStudyId.value,
    DepartmentId: editForm.department.value,
    Name: editForm.Name.value,
    ShortName: editForm.ShortName.value,
    UniqueId: editForm.UniqueId.value,
    Award: editForm.Award.value,
    Duration: editForm.Duration.value,
    RequiredCreditUnits: editForm.RequiredCreditUnits.value,
    Advisor: editForm.Advisor.value,
    UniqueId: editForm.UniqueId.value,
    Status: statusCheckbox.value,
  };

  if (editCourseOfStudy.CourseOfStudyId < 1) {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy duration";
    return false;
  }
  if (editCourseOfStudy.DepartmentId == 0) {
    errorMsg.innerHTML = "Please enter a valid Department id";
    return false;
  }
  if (editCourseOfStudy.Name.length < 3 || editCourseOfStudy.Name.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy name";
    return false;
  }
  if (editCourseOfStudy.ShortName.length < 3 || editCourseOfStudy.ShortName.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy code";
    return false;
  }
  if (editCourseOfStudy.Award.length < 3 || editCourseOfStudy.Award.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy award";
    return false;
  }
  if (editCourseOfStudy.Duration < 1) {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy duration";
    return false;
  }
  if (editCourseOfStudy.RequiredCreditUnits < 1) {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy required credit units";
    return false;
  }
  if (editCourseOfStudy.Advisor.length < 3 || editCourseOfStudy.Advisor.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy advisor";
    return false;
  }
  if (editCourseOfStudy.UniqueId.length < 3 || editCourseOfStudy.UniqueId.length == "") {
    errorMsg.innerHTML = "Please enter a valid courseOfStudy unique id";
    return false;
  }

  await fetch("http://localhost:8097/api/v1/coursesOfStudy", {
    method: "PUT",
    body: JSON.stringify(editCourseOfStudy),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// SEARCHING THROUGH FACULTIES
const searchCourseOfStudy = document.getElementById("searchCourseOfStudy");

searchCourseOfStudy.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const errorMsg = document.getElementById("error_msg_search")
  const table = document.getElementById("table");
  let tableBody = table.lastElementChild;
  tableBody.innerHTML = "";

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const search = {
    departmentId: searchCourseOfStudy.department.value,
    name: searchCourseOfStudy.Name.value,
    status: statusCheckbox.value,
  }
//   console.log(search)

  const response = await fetch('http://localhost:8097/api/v1/coursesOfStudy/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(search),
  });

  if(response.status == 404){
    const Error = await response.json();
    document.getElementById("error").innerHTML = Error.Error
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
          <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteFaculty(${
            item.CourseOfStudyId
          })>Delete</button>
      </td>
      `
    })
  }
  
});

const clearSearchBtn = document.getElementById("clear_search_btn");

clearSearchBtn.addEventListener("click", ()=>{
  location.reload();
})

// DETAILS OF COURSE OF SRUDY
const courseOfStudyDetails = async (id) => {
  const response = await fetch('http://localhost:8097/api/v1/coursesOfStudy/' + id, {
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

    document.getElementById("courseOfStudyDepartment").innerHTML = `Course Of Study Department: ${filteredDepartment.map(item => {return item.Name})}`;
    document.getElementById("courseOfStudyName").innerHTML = `Course Of Study Name: ${item.Name}`;
    document.getElementById("courseOfStudyShortName").innerHTML = `Course Of Study Short Name: ${item.ShortName}`;
    document.getElementById("courseOfStudyUniqueId").innerHTML = `Course Of Study Unique Id: ${item.UniqueId}`;
    document.getElementById("courseOfStudyAward").innerHTML = `Course Of Study Awards: ${item.Award}`;
    document.getElementById("courseOfDuration").innerHTML = `Course Of Study Duration: ${item.Duration}`;
    document.getElementById("courseOfRequiredCreditUnits").innerHTML = `Course Of Study Required Credit Units: ${item.RequiredCreditUnits}`;
    document.getElementById("courseOfStudyAdvisor").innerHTML = `Course Of Study Advisor: ${item.Advisor}`;
    document.getElementById("courseOfStudyStatus").innerHTML = `Course Of Study Status: ${status}`;

  })
   
}