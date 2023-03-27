// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let departmentArray;
let realData;
let lecturerId;
let show;
const addForm = document.getElementById("addFaculty");
const errorMsg = document.getElementById("error_msg");
const tbody = document.getElementById("tbody");
const validate = new validator();
let apiEndpoint = "http://192.168.17.220:8097/api/v1/lecturers";

const renderData = async () => {
  validate.populatePage();
  const data = await fetch(apiEndpoint);
  realData = await data.json();

  const department = await fetch("http://192.168.17.220:8097/api/v1/departments");
  departmentArray = await department.json();

  populateDropDown()

  let status = "";

  realData.forEach((lecturer, index) => {
        renderTable(lecturer, index, status)
  });

};


const populateDropDown = () => {
  const departmentSelect = document.getElementById("departmentId");
  const departmentSelect_Search = document.getElementById("Faculty_Search");

  let startCode = '<option value="0">-- Please select a department --</option>'

  const selectOption = departmentArray.map(item=>{ return  `<option value="${item.DepartmentId}">${item.Name}</option>`; })
  departmentSelect.innerHTML = startCode + selectOption.join("");
  departmentSelect_Search.innerHTML = startCode + selectOption.join("");
}

const editLecturer = async (id) => {
  document.getElementById("exampleModalLabel").innerHTML = "Edit Lecturers";
  const lecturer = realData.find((lecturer) => lecturer.LecturerId === id);
  lecturerId = lecturer.LecturerId;
  show = false;
  addForm.department.value = lecturer.DepartmentId;
  addForm.Surname.value = lecturer.Surname;
  addForm.FirstName.value = lecturer.FirstName;
  addForm.OtherName.value = lecturer.OtherNames;
  addForm.StaffId.value = lecturer.StaffId;
};

document.getElementById("addBtn").addEventListener("click", ()=>{
  document.getElementById("exampleModalLabel").innerHTML = "Add Lecturers";
  show = true;
  addForm.department.value = 0;
  addForm.Surname.value = "";
  addForm.FirstName.value = "";
  addForm.OtherName.value = "";
  addForm.StaffId.value = "";
})

// DELETING FACULTIES
const deletelecturer = async (id) => {
  const responses = await fetch(
    apiEndpoint + "/" + id,
    {
      method: "DELETE",
    }
  );
    
    location.reload();
  
};

const createLecturer = async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const newLecturer = {
    DepartmentId: Number(addForm.department.value),
    Surname: addForm.Surname.value,
    FirstName: addForm.FirstName.value,
    OtherNames: addForm.OtherName.value,
    StaffId: addForm.StaffId.value,
    Status: Number(statusCheckbox.value),
  };

  // check for errors in the form
  const validateInput = validation(newLecturer);
  if(!validateInput){return false}

  await fetch(apiEndpoint + "/add", {
    method: "POST",
    body: JSON.stringify(newLecturer),
    headers: { "Content-Type": "application/json" }
  });

  location.reload();
}

const updateLecturer = async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const editLecturer = {
    LecturerId: lecturerId,
    DepartmentId: Number(addForm.department.value),
    Surname: addForm.Surname.value,
    FirstName: addForm.FirstName.value,
    OtherNames: addForm.OtherName.value,
    StaffId: addForm.StaffId.value,
    Status: Number(statusCheckbox.value),
  };

  // check for errors in the form
  const validateInput = validation(editLecturer);
  if(!validateInput){return false}

  await fetch(apiEndpoint, {
    method: "PUT",
    body: JSON.stringify(editLecturer),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
}

// FORM HANDLING
addForm.addEventListener("submit", async (e) => {
    show ? createLecturer(e) : updateLecturer(e)
});

// SEARCHING THROUGH FACULTIES
const searchLecturer = document.getElementById("searchLecturer");
searchLecturer.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const errorMsg = document.getElementById("error_msg_search")
  tbody.innerHTML = "";

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const search = {
    DepartmentId: searchLecturer.department.value,
    FirstName: searchLecturer.Firstname.value,
    Status: statusCheckbox.value,
  }

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(search)
  });

  if(!response.ok){
    document.getElementById("error").innerHTML = "This lecturer does not exist";
  }else{
    document.getElementById("error").innerHTML = "";
    errorMsg.innerHTML = "";
    const searchData = await response.json();
    let status = "";

    searchData.forEach((lecturer, index)=>{
        renderTable(lecturer, index, status)
    })
  }
});

const renderTable = (lecturer, index, status) => {
  const row = tbody.insertRow();
  lecturer.Status > 0 ? status = "Active" : status = "Inactive";
  const filteredDepartment = departmentArray.find((department) => department.DepartmentId === lecturer.DepartmentId);
  row.innerHTML = `
          <td>${index + 1}</td>
          <td>${filteredDepartment.Name}</td>
          <td>${lecturer.Surname}</td>
          <td>${lecturer.FirstName}</td>
          <td class=${
            status == "Active" ? "text-success" : "text-danger"
          }>${status}</td>
          <td>
              <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#exampleModal" onclick=editLecturer(${lecturer.LecturerId})>Edit</button>
              <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deletelecturer(${
                lecturer.LecturerId
              })>Delete</button>
              <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#detailModal" onclick=lecturerDetails(${
                lecturer.LecturerId
              })>Details</button>
          </td>
      `;
}

const clearSearchBtn = document.getElementById("clear_search_btn");

clearSearchBtn.addEventListener("click", ()=>{
  location.reload();
})

const lecturerDetails = async (id) => {
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
    document.getElementById("lecturerDepartment").innerHTML = `Lecturer Department: ${filteredDepartment.Name}`;
    document.getElementById("lecturerName").innerHTML = `Lecturer Name: ${item.FirstName}`;
    document.getElementById("lecturerSurname").innerHTML = `Lecturer Surname: ${item.Surname}`;
    document.getElementById("lecturerOtherName").innerHTML = `Lecturer Other Names: ${item.OtherNames}`;
    document.getElementById("lecturerStaffId").innerHTML = `Lecturer StaffId: ${item.StaffId}`;
    document.getElementById("lecturerStatus").innerHTML = `Lecturer Status: ${status}`;
  })
}

// VALIDATION SYSTEM
const validation = (lecturerDetails) => {
  if (!validate.minimumInteger(lecturerDetails.DepartmentId, 1, "Department Id")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(lecturerDetails.Surname, 3, "Lecturer Surname")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(lecturerDetails.FirstName, 3, "Lecturer First Name")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(lecturerDetails.OtherNames, 3, "Lecturer Other Names")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(lecturerDetails.StaffId, 3, "Lecturer StaffId")) { errorMsg.innerHTML = validate.getError(); return false;}
  return true;
}