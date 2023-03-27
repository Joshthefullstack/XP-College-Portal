// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let realData;
let facultyId;
let show;
const validate = new validator();
const errorMsg = document.getElementById("error_msg");
const tbody = document.getElementById("tbody");
const addForm = document.getElementById("addFaculty");
const apiEndpoint = "http://192.168.17.220:8097/api/v1/faculties";

const renderData = async () => {
  const data = await fetch(apiEndpoint);
  realData = await data.json();

  let status = "";

  validate.populatePage();

  realData.forEach((faculty, index) => {
      renderTable(faculty, index, status)
  });
};

const editFaculty = async (id) => {
  show = false;
  document.getElementById("exampleModalLabel").innerHTML = "Edit Faculty";
  const faculty = realData.find((faculty) => faculty.FacultyId === id);
  facultyId = faculty.FacultyId;
  addForm.Name.value = faculty.Name;
  addForm.Code.value = faculty.Code.trim();
  addForm.UniqueId.value = faculty.UniqueId.trim();
};

document.getElementById("addBtn").addEventListener("click", () => {
  document.getElementById("exampleModalLabel").innerHTML = "Add Faculty";
  show = true;
  addForm.Name.value = "";
  addForm.Code.value = "";
  addForm.UniqueId.value = "";
});


const searchFacult = document.getElementById("searchFaculty");
searchFacult.addEventListener("submit", (e) => {
  searchFaculty(e);
});

const searchFaculty = async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  tbody.innerHTML = "";

  statusCheckbox.checked
    ? (statusCheckbox.value = 1)
    : (statusCheckbox.value = 0);

  const search = {
    Name: searchFacult.Name.value,
    Status: statusCheckbox.value,
  };

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(search),
  });

  if (!response.ok) {
    const Error = await response.json();
    if (Error.Error == "") {
      document.getElementById("error").innerHTML =
        "This faculty does not exist";
      document.getElementById("error").classList.add("text-bg-danger");
    }
  } else {
    document.getElementById("error").innerHTML = "";
    const searchData = await response.json();

    let status = "";

    searchData.forEach((item, index) => {
    renderTable(item, index, status);
  })
  }};

const renderTable = (faculty, index, status) => {
  const row = tbody.insertRow();
  faculty.Status > 0 ? (status = "Active") : (status = "Inactive");
  row.innerHTML = `
          <td>${index + 1}</td>
          <td>${faculty.Name}</td>
          <td>${faculty.Code}</td>
          <td>${faculty.UniqueId}</td>
          <td class=${
            status == "Active" ? "text-success" : "text-danger"
          }>${status}</td>
          <td>
              <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#exampleModal" onclick=editFaculty(${
                faculty.FacultyId
              })>Edit</button>
              <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteFaculty(${
                faculty.FacultyId
              })>Delete</button>
          </td>
      `;
}

// DELETING FACULTIES
const deleteFaculty = async (id) => {
  const responses = await fetch(apiEndpoint + "/" + id, {
    method: "DELETE",
  });

  if (!responses.ok) {
    document.getElementById("delete_error").innerHTML =
      "There are departments dependents on this faculty";
    document
      .getElementById("delete_error")
      .classList.add("bg-danger", "text-light", "p-1");
  } else {
    location.reload();
  }
};

const createFaculties = async (e) => {
  e.preventDefault();

  const statusCheckbox = document.getElementById("status_checkbox_edit");
  statusCheckbox.checked
  ? (statusCheckbox.value = 1)
  : (statusCheckbox.value = 0);

  const newFaculty = {
    Name: addForm.Name.value,
    Code: addForm.Code.value,
    UniqueId: addForm.UniqueId.value,
    Status: Number(statusCheckbox.value),
  };

  // check for errors in the form
  const validateInput = validation(newFaculty);
  if(!validateInput){return false}

  await fetch(apiEndpoint + "/add", {
    method: "POST",
    body: JSON.stringify(newFaculty),
    headers: { "Content-Type": "application/json" },
  });
  location.reload();
};

const editFaculties = async (e) => {
  e.preventDefault();

  const statusCheckbox = document.getElementById("status_checkbox_edit");
  statusCheckbox.checked
  ? (statusCheckbox.value = 1)
  : (statusCheckbox.value = 0);

  const editFaculty = {
    FacultyId: facultyId,
    Name: addForm.Name.value,
    Code: addForm.Code.value,
    UniqueId: addForm.UniqueId.value,
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
};

addForm.addEventListener("submit", (e) => {
  show ? createFaculties(e) : editFaculties(e);
});

const clearSearchBtn = document.getElementById("clear_search_btn");

clearSearchBtn.addEventListener("click", () => {
  searchFacult.Name.value = "";
  location.reload();
});

const validation = (facultyDetails) => {
  if (!validate.minLength(facultyDetails.Name, 3, "Faculty Name")) {errorMsg.innerHTML = validate.getError(); return false; }
  if (!validate.minLength(facultyDetails.Code, 3, "Faculty Code")) { errorMsg.innerHTML = validate.getError(); return false; }
  if (!validate.minLength(facultyDetails.UniqueId, 3, "Faculty Unique Id")) { errorMsg.innerHTML = validate.getError(); return false; }
  return true;
}

