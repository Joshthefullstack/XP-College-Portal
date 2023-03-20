// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let departmentArray;
let realData;
let lecturerId;

const renderData = async () => {

  const head = await fetch("../academicSetup/js/head.js");
  const response = await head.text();
  document.getElementById("lecturerHead").innerHTML = response;

  const sideBar = await fetch("../academicSetup/js/sidebar.js");
  const side = await sideBar.text();
  document.getElementById("lecturerSideBar").innerHTML = side;

  const topBar = await fetch("../academicSetup/js/topbar.js");
  const top = await topBar.text();
  document.querySelector("#topNav").innerHTML = top;


  let uri = "http://localhost:8097/api/v1/lecturers";

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

  realData.forEach((lecturer, index) => {
    const row = tbody.insertRow();

    lecturer.Status > 0 ? status = "Active" : status = "Inactive";

    const filteredDepartment = departmentArray.filter((department, index)=>{
        if(lecturer.DepartmentId == department.DepartmentId){
            return true;
        }
    });

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${filteredDepartment.map(item => {return item.Name})}</td>
            <td>${lecturer.Surname}</td>
            <td>${lecturer.FirstName}</td>
            <td class=${
              status == "Active" ? "text-success" : "text-danger"
            }>${status}</td>
            <td>
                <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
                data-bs-target="#editModal" onclick=editLecturer(${lecturer.LecturerId})>Edit</button>
                <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deletelecturer(${
                  lecturer.LecturerId
                })>Delete</button>
                <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
                data-bs-target="#detailModal" onclick=lecturerDetails(${
                  lecturer.LecturerId
                })>Details</button>
            </td>
        `;
  });

};

const editLecturer = async (id) => {
  const lecturer = realData.find((lecturer) => lecturer.LecturerId === id);
  lecturerId = lecturer.LecturerId;
};

// DELETING FACULTIES
const deletelecturer = async (id) => {
  const responses = await fetch(
    "http://localhost:8097/api/v1/lecturers/" + id,
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

  const newLecturer = {
    DepartmentId: addForm.department.value,
    Surname: addForm.Surname.value,
    FirstName: addForm.FirstName.value,
    OtherName: addForm.OtherName.value,
    StaffId: addForm.StaffId.value,
    Status: statusCheckbox.value,
  };

  // check for errors in the form
  if (newLecturer.DepartmentId == 0) {
    errorMsg.innerHTML = "Please enter a valid Department id";
    return false;
  }
  if (newLecturer.Surname.length < 3 || newLecturer.Surname.length == "") {
    errorMsg.innerHTML = "Please enter a valid lecturer surname";
    return false;
  }
  if (newLecturer.FirstName.length < 3 || newLecturer.FirstName.length == "") {
    errorMsg.innerHTML = "Please enter a valid lecturer first name";
    return false;
  }
  if (newLecturer.OtherName.length < 3 || newLecturer.OtherName.length == "") {
    errorMsg.innerHTML = "Please enter a valid lecturer other name";
    return false;
  }
  if (newLecturer.StaffId < 1) {
    errorMsg.innerHTML = "Please enter a valid lecturer staff id";
    return false;
  }


  await fetch("http://localhost:8097/api/v1/lecturers/add", {
    method: "POST",
    body: JSON.stringify(newLecturer),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// EDITING FACULTIES
const editForm = document.getElementById("editLecturer");

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_edit");
  const errorMsg = document.getElementById("error_msg_edit");

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const editLecturer = {
    LecturerId: lecturerId,
    DepartmentId: editForm.department.value,
    Surname: editForm.Surname.value,
    FirstName: editForm.FirstName.value,
    OtherName: editForm.OtherName.value,
    StaffId: editForm.StaffId.value,
    Status: statusCheckbox.value,
  };

    // check for errors in the form
    if (editLecturer.DepartmentId == 0) {
        errorMsg.innerHTML = "Please enter a valid Department id";
        return false;
      }
      if (editLecturer.Surname.length < 3 || editLecturer.Surname.length == "") {
        errorMsg.innerHTML = "Please enter a valid lecturer surname";
        return false;
      }
      if (editLecturer.FirstName.length < 3 || editLecturer.FirstName.length == "") {
        errorMsg.innerHTML = "Please enter a valid lecturer first name";
        return false;
      }
      if (editLecturer.OtherName.length < 3 || editLecturer.OtherName.length == "") {
        errorMsg.innerHTML = "Please enter a valid lecturer other name";
        return false;
      }
      if (editLecturer.StaffId < 1) {
        errorMsg.innerHTML = "Please enter a valid lecturer staff id";
        return false;
      }


  await fetch("http://localhost:8097/api/v1/lecturers", {
    method: "PUT",
    body: JSON.stringify(editLecturer),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// SEARCHING THROUGH FACULTIES
const searchLecturer = document.getElementById("searchLecturer");

searchLecturer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const errorMsg = document.getElementById("error_msg_search")
  const table = document.getElementById("table");
  let tableBody = table.lastElementChild;
  tableBody.innerHTML = "";

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const search = {
    deptId: searchLecturer.department.value,
    firstname: searchLecturer.Firstname.value,
    status: statusCheckbox.value,
  }

  const response = await fetch('http://localhost:8097/api/v1/lecturers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(search)
  });

  if(response.status == 400){
    document.getElementById("error").innerHTML = "This lecturer does not exist";
  }

  if(response.status == 200){
    document.getElementById("error").innerHTML = "";
    errorMsg.innerHTML = "";
    const searchData = await response.json();

    let status = "";

    searchData.forEach((lecturer, index)=>{
      const row = tableBody.insertRow();

      lecturer.Status > 0 ? status = "Active" : status = "Inactive";

      const filteredDepartment = departmentArray.filter((faculty, index)=>{
        if(lecturer.DepartmentId == faculty.DepartmentId){
            return true;
        }
    })

      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${filteredDepartment.map(item => {return item.Name})}</td>
      <td>${lecturer.Surname}</td>
      <td>${lecturer.FirstName}</td>
      <td class=${
        status == "Active" ? "text-success" : "text-danger"
      }>${status}</td>
      <td>
          <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
          data-bs-target="#editModal">Edit</button>
          <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deletelecturer(${
            lecturer.LecturerId
          })>Delete</button>
          <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
          data-bs-target="#detailModal" onclick=lecturerDetails(${
            lecturer.LecturerId
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

const lecturerDetails = async (id) => {
  const response = await fetch('http://localhost:8097/api/v1/lecturers/' + id, {
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

    document.getElementById("lecturerDepartment").innerHTML = `Lecturer Department: ${filteredDepartment.map(item => {return item.Name})}`;
    document.getElementById("lecturerName").innerHTML = `Lecturer Name: ${item.FirstName}`;
    document.getElementById("lecturerSurname").innerHTML = `Lecturer Surname: ${item.Surname}`;
    document.getElementById("lecturerOtherName").innerHTML = `Lecturer Other Names: ${item.OtherName}`;
    document.getElementById("lecturerStaffId").innerHTML = `Lecturer StaffId: ${item.StaffId}`;
    document.getElementById("lecturerStatus").innerHTML = `Lecturer Status: ${status}`;

  })
   
}