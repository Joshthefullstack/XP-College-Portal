// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let facultyArray;
let realData;
let departmentId;
let show;
const validate = new validator();
const addForm = document.getElementById("addFaculty");
const errorMsg = document.getElementById("error_msg");
const tbody = document.getElementById("tbody");
let apiEndpoint = "http://192.168.17.220:8097/api/v1/departments";

// RENDERING DATA TO TABLE
const renderData = async () => {
  validate.populatePage()

  const data = await fetch(apiEndpoint);
  realData = await data.json();

  const facultySelect = document.getElementById("Faculty");
  const facultySelect_Search = document.getElementById("Faculty_Search");
  const faculty = await fetch("http://192.168.17.220:8097/api/v1/faculties");
  facultyArray = await faculty.json();
  
  let startCode = '<option value="0">-- Please select a faculty --</option>'

  const selectOption = facultyArray.map((item, index)=>{
    return  `<option value="${item.FacultyId}">${item.Name}</option>`;
  })
  facultySelect.innerHTML = startCode + selectOption.join("");
  facultySelect_Search.innerHTML = startCode + selectOption.join("");


  let status = "";

  realData.forEach((department, index) => {
      renderTable(department, index, status)
  });

};

// EDIT BUTTON
const editDepartment = async (id) => {
  show = false;
  document.getElementById("exampleModalLabel").innerHTML = "Edit Faculty";
  const department = realData.find((department) => department.DepartmentId === id);
  departmentId = department.DepartmentId;
  addForm.Faculty.value = department.FacultyId;
  addForm.Name.value = department.Name;
  addForm.Code.value = department.Code.trim();
  addForm.UniqueId.value = department.UniqueId.trim();
};

// ADD BUTTON 
document.getElementById("addBtn").addEventListener("click", () => {
  document.getElementById("exampleModalLabel").innerHTML = "Add Department";
  show = true;
  addForm.Faculty.value = 0;
  addForm.Name.value = "";
  addForm.Code.value = "";
  addForm.UniqueId.value = "";
});

// DELETING FACULTIES
const deleteDepartment = async (id) => {
  const responses = await fetch(
    apiEndpoint + "/" + id,
    {
      method: "DELETE",
    }
  );
    if (!responses.ok) {
      document.getElementById("delete_error").innerHTML = "There are some courses or course of studies or lecturers dependents inside this department";
      document
        .getElementById("delete_error")
        .classList.add("bg-danger", "text-light", "p-1");
    } else {
      location.reload();
    }
  
};

// CREATING DEPARTMENTS
const createDepartments = async (e) => {
  e.preventDefault();

  const statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const newDepartment = {
    FacultyId: Number(addForm.Faculty.value),
    Name: addForm.Name.value,
    Code: addForm.Code.value.trim(),
    UniqueId: addForm.UniqueId.value.trim(),
    Status: Number(statusCheckbox.value),
  };

  // check for errors in the form
  const validateInput = validation(newDepartment);
  if(!validateInput){return false}

  await fetch(apiEndpoint + "/add", {
    method: "POST",
    body: JSON.stringify(newDepartment),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
}

// EDITING DEPARTMENTS
const editDepartments = async (e) => {
  e.preventDefault();

  const statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const editFaculty = {
    DepartmentId: departmentId,
    FacultyId: addForm.Faculty.value,
    Name: addForm.Name.value,
    Code: addForm.Code.value.trim(),
    UniqueId: addForm.UniqueId.value.trim(),
    Status: Number(statusCheckbox.value),
  };

  const validateInput = validation(editFaculty);
  if(!validateInput){return false}

  await fetch(apiEndpoint, {
    method: "PUT",
    body: JSON.stringify(editFaculty),
    headers: { "Content-Type": "application/json" },
  });
  location.reload();
}

// FORM SUBMISSION FOR BOTH ADD AND EDIT FORM
addForm.addEventListener("submit", (e) => {
  show ? createDepartments(e) : editDepartments(e);
});


// SEARCHING THROUGH FACULTIES
const searchDepartment = document.getElementById("searchDepartment");
searchDepartment.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const errorMsg = document.getElementById("error_msg_search")
  tbody.innerHTML = "";

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const search = {
    FacultyId: searchDepartment.Faculty.value,
    Name: searchDepartment.Name.value,
    Status: Number(statusCheckbox.value),
  }

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(search),
  });

  if(!response.ok){
    const Error = await response.json();
    document.getElementById("error").innerHTML = Error.Error
  }else{
    document.getElementById("error").innerHTML = "";
    errorMsg.innerHTML = "";
    const searchData = await response.json();

    let status = "";

    searchData.forEach((item, index)=>{
      renderTable(item, index, status);
    })
  }
  
});

// RENDERING DATA TABLE
const renderTable = (department, index, status) => {
  const row = tbody.insertRow();
  department.Status > 0 ? status = "Active" : status = "Inactive";
  const faculty = facultyArray.find((facult) => department.FacultyId == facult.FacultyId);

  row.innerHTML = `
          <td>${index + 1}</td>
          <td>${faculty.Name}</td>
          <td>${department.Name}</td>
          <td>${department.Code}</td>
          <td>${department.UniqueId}</td>
          <td class=${
            status == "Active" ? "text-success" : "text-danger"
          }>${status}</td>
          <td>
              <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#exampleModal" onclick=editDepartment(${department.DepartmentId})>Edit</button>
              <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteDepartment(${
                department.DepartmentId
              })>Delete</button>
          </td>
      `;
}

// RESET BUTTON
const clearSearchBtn = document.getElementById("clear_search_btn");
clearSearchBtn.addEventListener("click", ()=>{
  location.reload();
});

// VALIDATION SYSTEM
const validation = (departmentDetails) => {
  if (!validate.minimumInteger(departmentDetails.FacultyId, 1, "Faculty")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(departmentDetails.Name, 3, "Department Name")) {errorMsg.innerHTML = validate.getError(); return false; }
  if (!validate.minLength(departmentDetails.Code, 3, "Department Code")) { errorMsg.innerHTML = validate.getError(); return false; }
  if (!validate.minLength(departmentDetails.UniqueId, 3, "Department Unique Id")) { errorMsg.innerHTML = validate.getError(); return false; }
  return true;
}