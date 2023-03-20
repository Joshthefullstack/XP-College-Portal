// const { Validator } = require("./Validator");

// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let realData;
let facultyId;

const renderData = async () => {
  let uri = "http://localhost:8097/api/v1/faculties";

  const data = await fetch(uri);
  realData = await data.json();

  const tbody = document.getElementById("tbody");

  let status = "";

  const head = await fetch("../academicSetup/js/head.js");
  const response = await head.text();
  document.getElementById("facultyHead").innerHTML = response;

  const sideBar = await fetch("../academicSetup/js/sidebar.js");
  const side = await sideBar.text();
  document.getElementById("facultySideBar").innerHTML = side;

  const topBar = await fetch("../academicSetup/js/topbar.js");
  const top = await topBar.text();
  document.querySelector("#topNav").innerHTML = top;

  realData.forEach((faculty, index) => {
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
                data-bs-target="#editModal" onclick=editFaculty(${
                  faculty.FacultyId
                })>Edit</button>
                <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteFaculty(${
                  faculty.FacultyId
                })>Delete</button>
            </td>
        `;
  });
};

const editFaculty = async (id) => {
  const faculty = realData.find((faculty) => faculty.FacultyId === id);
  facultyId = faculty.FacultyId;
};

// DELETING FACULTIES
const deleteFaculty = async (id) => {
  const responses = await fetch(
    "http://localhost:8097/api/v1/faculties/" + id,
    {
      method: "DELETE",
    }
  );
  if (responses.status == 400) {
    document.getElementById("delete_error").innerHTML =
      "There are departments dependents on this faculty";
    document
      .getElementById("delete_error")
      .classList.add("bg-danger", "text-light", "p-1");
  } else {
    location.reload();
  }
};

// FORM HANDLING
const addForm = document.getElementById("addFaculty");

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox");
  const errorMsg = document.getElementById("error_msg");

  statusCheckbox.checked
    ? (statusCheckbox.value = 1)
    : (statusCheckbox.value = 0);

  const newFaculty = {
    Name: addForm.Name.value,
    Code: addForm.Code.value,
    UniqueId: addForm.UniqueId.value,
    Status: statusCheckbox.value,
  };

  // check for errors in the form
  if (newFaculty.Name.length < 3 || newFaculty.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid faculty name";
    return false;
  }
  if (newFaculty.Code.length < 3 || newFaculty.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid faculty code";
    return false;
  }
  if (newFaculty.UniqueId.length < 3 || newFaculty.UniqueId.length == "") {
    errorMsg.innerHTML = "Please enter a valid faculty unique id";
    return false;
  }

  await fetch("http://localhost:8097/api/v1/faculties/add", {
    method: "POST",
    body: JSON.stringify(newFaculty),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// EDITING FACULTIES
const editForm = document.getElementById("editFaculty");

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_edit");
  const errorMsg = document.getElementById("error_msg_edit");

  statusCheckbox.checked
    ? (statusCheckbox.value = 1)
    : (statusCheckbox.value = 0);

  const editFaculty = {
    FacultyId: facultyId,
    Name: editForm.Name.value,
    Code: editForm.Code.value,
    UniqueId: editForm.UniqueId.value,
    Status: statusCheckbox.value,
  };
  console.log(editFaculty);

  if (
    typeof editFaculty.FacultyId !== "string" ||
    editFaculty.FacultyId == ""
  ) {
    errorMsg.innerHTML = "Please enter a valid Faculty Id";
  } else if (editFaculty.Name.length < 3 || editFaculty.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid faculty name";
  } else if (editFaculty.Code.length < 3 || editFaculty.Code.length == "") {
    errorMsg.innerHTML = "Please enter a valid faculty code";
  } else if (
    editFaculty.UniqueId.length < 3 ||
    editFaculty.UniqueId.length == ""
  ) {
    errorMsg.innerHTML = "Please enter a valid faculty unique id";
  }

  await fetch("http://localhost:8097/api/v1/faculties", {
    method: "PUT",
    body: JSON.stringify(editFaculty),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
});

// SEARCHING THROUGH FACULTIES
const searchFaculty = document.getElementById("searchFaculty");

searchFaculty.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const table = document.getElementById("table");
  let tableBody = table.lastElementChild;
  tableBody.innerHTML = "";

  statusCheckbox.checked
    ? (statusCheckbox.value = 1)
    : (statusCheckbox.value = 0);

  const search = {
    name: searchFaculty.Name.value,
    status: statusCheckbox.value,
  };

  const response = await fetch("http://localhost:8097/api/v1/faculties/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(search),
  });

  if (response.status == 400) {
    const Error = await response.json();
    if (Error.Error == "") {
      document.getElementById("error").innerHTML =
        "This faculty does not exist";
      document.getElementById("error").classList.add("text-bg-danger");
    }
  }

  if (response.status == 200) {
    document.getElementById("error").innerHTML = "";
    const searchData = await response.json();

    let status = "";

    searchData.forEach((item, index) => {
      const row = tableBody.insertRow();

      item.Status > 0 ? (status = "Active") : (status = "Inactive");

      row.innerHTML = `
      <td>${index + 1}</td>
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
            item.FacultyId
          })>Delete</button>
      </td>
      `;
    });
  }
});

const clearSearchBtn = document.getElementById("clear_search_btn");

clearSearchBtn.addEventListener("click", () => {
  location.reload();
});
