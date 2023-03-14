// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let facultyArray;

const renderData = async () => {
  let uri = "http://localhost:8097/api/v1/departments";

  const data = await fetch(uri);
  realData = await data.json();

  const facultySelect = document.getElementById("Faculty");
  const facultySelect_Edit = document.getElementById("Faculty_Edit");
  const facultySelect_Search = document.getElementById("Faculty_Search");
  const faculty = await fetch("http://localhost:8097/api/v1/faculties");
  facultyArray = await faculty.json();

  const tbody = document.getElementById("tbody");
  
  let startCode = '<option value="0">-- Please select a faculty --</option>'

  const selectOption = facultyArray.map((item, index)=>{
    return  `<option value="${item.FacultyId}">${item.Name}</option>`;
  })
  facultySelect.innerHTML = startCode + selectOption.join("");
  facultySelect_Edit.innerHTML = startCode + selectOption.join("");
  facultySelect_Search.innerHTML = startCode + selectOption.join("");


  let status = "";

  realData.forEach((department, index) => {
    const row = tbody.insertRow();

    department.Status > 0 ? status = "Active" : status = "Inactive";

    const filteredFaculty = facultyArray.filter((faculty, index)=>{
        if(department.FacultyId == faculty.FacultyId){
            return true;
        }
    })

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${filteredFaculty.map(item => {return item.Name})}</td>
            <td>${department.Name}</td>
            <td>${department.Code}</td>
            <td>${department.UniqueId}</td>
            <td class=${
              status == "Active" ? "text-success" : "text-danger"
            }>${status}</td>
            <td>
                <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
                data-bs-target="#editModal">Edit</button>
                <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteDepartment(${
                  department.DepartmentId
                })>Delete</button>
            </td>
        `;
  });

};

// DELETING FACULTIES
const deleteDepartment = async (id) => {
  const responses = await fetch(
    "http://localhost:8097/api/v1/departments/" + id,
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

  const newDepartment = {
    FacultyId: addForm.Faculty.value,
    Name: addForm.Name.value,
    Code: addForm.Code.value,
    UniqueId: addForm.UniqueId.value,
    Status: statusCheckbox.value,
  };

  // check for errors in the form
  if (newDepartment.Name.length < 3 || newDepartment.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid department name";
    return false;
  }
  if (newDepartment.Code.length < 3 || newDepartment.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid department code";
    return false;
  }
  if (newDepartment.UniqueId.length < 3 || newDepartment.UniqueId.length == "") {
    errorMsg.innerHTML = "Please enter a valid department unique id";
    return false;
  }

  await fetch("http://localhost:8097/api/v1/departments/add", {
    method: "POST",
    body: JSON.stringify(newDepartment),
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

  const editFaculty = {
    DepartmentId: editForm.DepartmentId.value,
    FacultyId: editForm.Faculty.value,
    Name: editForm.Name.value,
    Code: editForm.Code.value,
    UniqueId: editForm.UniqueId.value,
    Status: statusCheckbox.value,
  };

  if (
    typeof editFaculty.DepartmentId !== "string" ||
    editFaculty.DepartmentId == ""
  ) {
    errorMsg.innerHTML = "Please enter a valid department Id";
  } else if (editFaculty.Name.length < 3 || editFaculty.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid department name";
  } else if (editFaculty.Code.length < 3 || editFaculty.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid department code";
  } else if (
    editFaculty.UniqueId.length < 3 ||
    editFaculty.UniqueId.length == ""
  ) {
    errorMsg.innerHTML = "Please enter a valid department unique id";
  }

  await fetch("http://localhost:8097/api/v1/departments", {
    method: "PUT",
    body: JSON.stringify(editFaculty),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// SEARCHING THROUGH FACULTIES
const searchDepartment = document.getElementById("searchDepartment");

searchDepartment.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const errorMsg = document.getElementById("error_msg_search")
  const table = document.getElementById("table");
  let tableBody = table.lastElementChild;
  tableBody.innerHTML = "";

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const search = {
    facultyId: searchDepartment.Faculty.value,
    name: searchDepartment.Name.value,
    status: statusCheckbox.value,
  }
//   console.log(search)

  const response = await fetch('http://localhost:8097/api/v1/departments/', {
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

      const filteredFaculty = facultyArray.filter((faculty, index)=>{
        if(item.FacultyId == faculty.FacultyId){
            return true;
        }
    })

      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${filteredFaculty.map(item => {return item.Name})}</td>
      <td>${item.Name}</td>
      <td>${item.Code}</td>
      <td>${item.UniqueId}</td>
      <td class=${
        status == "Active" ? "text-success" : "text-danger"
      }>${status}</td>
      <td>
          <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
          data-bs-target="#editModal">Edit</button>
          <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteFaculty(${
            item.DepartmentId
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