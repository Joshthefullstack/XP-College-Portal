// GETTING FACULTIES
window.addEventListener("DOMContentLoaded", () => renderData());

let apiEndpoint = "http://192.168.17.220:8097/api/v1/coursesOfStudy";

let departmentArray;
let realData;
let courseOfStudyId;
let show;
const tbody = document.getElementById("tbody");
const validate = new validator();
const duration = [4, 5, 6, 7];
const errorMsg = document.getElementById("error_msg");
const addForm = document.getElementById("addFaculty");


const renderData = async () => {
  validate.populatePage()

  const data = await fetch(apiEndpoint);
  realData = await data.json();

  const department = await fetch("http://192.168.17.220:8097/api/v1/departments");
  departmentArray = await department.json();

  populateDropDown();

  let status = "";

  realData.forEach((courseOfStudy, index) => {
      renderTable(courseOfStudy, index, status)
  });

};

const populateDropDown = () => {
  let startCode = '<option value="0">-- Please select a department --</option>'
  const selectOption = departmentArray.map((item, index)=>{ return  `<option value="${item.DepartmentId}">${item.Name}</option>`; })
  document.getElementById("departmentId").innerHTML = startCode + selectOption.join("");
  document.getElementById("Faculty_Search").innerHTML = startCode + selectOption.join("");

  let initialCode = '<option value="0">-- Please select Duration for course of study --</option>';
  const select = duration.map((item, index) => { return `<option value="${item}">${item}</option> ` })
  document.getElementById("duration").innerHTML = initialCode + select.join("")
}

const editCourseOfStudy = async (id) => {
  document.getElementById("exampleModalLabel").innerHTML = "Edit Course Of Study";
  const courseOfStudy = realData.find((courseOfStudy) => courseOfStudy.CourseOfStudyId === id);
  courseOfStudyId = courseOfStudy.CourseOfStudyId;
  show = false;
  errorMsg.innerHTML = ""
  addForm.department.value = courseOfStudy.DepartmentId;
  addForm.Name.value = courseOfStudy.Name;
  addForm.ShortName.value = courseOfStudy.ShortName;
  addForm.UniqueId.value = courseOfStudy.UniqueId;
  addForm.Award.value = courseOfStudy.Award;
  addForm.Duration.value = courseOfStudy.Duration;
  addForm.RequiredCreditUnits.value = courseOfStudy.RequiredCreditUnits;
  addForm.Advisor.value = courseOfStudy.Advisor;
};

document.getElementById("addBtn").addEventListener("click", () => {
  document.getElementById("exampleModalLabel").innerHTML = "Add Course Of Study";
  show = true;
  errorMsg.innerHTML = ""
  addForm.department.value = 0;
  addForm.Name.value = "";
  addForm.ShortName.value = "";
  addForm.UniqueId.value = "";
  addForm.Award.value = "";
  addForm.Duration.value = 0;
  addForm.RequiredCreditUnits.value = 0;
  addForm.Advisor.value = "";
});


// DELETING FACULTIES
const deleteCourseOfStudy = async (id) => {
  const responses = await fetch(
    apiEndpoint + "/" +id,
    {
      method: "DELETE",
    }
  );
    
    location.reload();
};

const createCourseOfStudy = async (e) => {
  e.preventDefault();

  let statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  let newCourseOfStudy = {
    DepartmentId: Number(addForm.department.value),
    Name: addForm.Name.value,
    ShortName: addForm.ShortName.value,
    UniqueId: addForm.UniqueId.value,
    Award: addForm.Award.value,
    Duration: Number(addForm.Duration.value),
    RequiredCreditUnits: Number(addForm.RequiredCreditUnits.value),
    Advisor: addForm.Advisor.value,
    Status: Number( statusCheckbox.value),
  };

    // check for errors in the form
    const validateInput = validation(newCourseOfStudy);
    if(!validateInput){return false}

  await fetch(apiEndpoint + "/add", {
    method: "POST",
    body: JSON.stringify(newCourseOfStudy),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
}

const updateCourseOfStudy = async (e) => {
  e.preventDefault();

  let statusCheckbox = document.getElementById("status_checkbox");
  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  let editCourseOfStudy = {
    CourseOfStudyId: courseOfStudyId,
    DepartmentId: addForm.department.value,
    Name: addForm.Name.value,
    ShortName: addForm.ShortName.value,
    UniqueId: addForm.UniqueId.value,
    Award: addForm.Award.value,
    Duration: addForm.Duration.value,
    RequiredCreditUnits: addForm.RequiredCreditUnits.value,
    Advisor: addForm.Advisor.value,
    Status: Number( statusCheckbox.value),
  };

    // check for errors in the form
    const validateInput = validation(editCourseOfStudy);
    if(!validateInput){return false}

  await fetch(apiEndpoint, {
    method: "PUT",
    body: JSON.stringify(editCourseOfStudy),
    headers: { "Content-Type": "application/json" },
  });

  location.reload();
};

addForm.addEventListener("submit", async (e) => {
  show ? createCourseOfStudy(e) : updateCourseOfStudy(e);
});

// SEARCHING THROUGH FACULTIES
const searchCourseOfStudy = document.getElementById("searchCourseOfStudy");

searchCourseOfStudy.addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusCheckbox = document.getElementById("status_checkbox_search");
  const errorMsg = document.getElementById("error_msg_search")
  tbody.innerHTML = "";

  statusCheckbox.checked ? statusCheckbox.value = 1 : statusCheckbox.value = 0;

  const search = {
    DepartmentId: Number(searchCourseOfStudy.department.value),
    Name: searchCourseOfStudy.Name.value,
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

const renderTable = (courseOfStudy, index, status) => {
  const row = tbody.insertRow();
  courseOfStudy.Status > 0 ? status = "Active" : status = "Inactive";
  const filteredDepartment = departmentArray.find((department) => department.DepartmentId === courseOfStudy.DepartmentId)
  row.innerHTML = `
          <td>${index + 1}</td>
          <td>${filteredDepartment.Name}</td>
          <td>${courseOfStudy.Name}</td>
          <td>${courseOfStudy.UniqueId}</td>
          <td class=${
            status == "Active" ? "text-success" : "text-danger"
          }>${status}</td>
          <td>
              <button class="btn btn-success me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#exampleModal" onclick=editCourseOfStudy(${courseOfStudy.CourseOfStudyId})>Edit</button>
              <button class="btn btn-danger me-md-2 mr-1" type="button" onclick=deleteCourseOfStudy(${
                courseOfStudy.CourseOfStudyId
              })>Delete</button>
              <button class="btn btn-primary me-md-2 mr-1" type="button" data-bs-toggle="modal"
              data-bs-target="#detailModal" onclick=courseOfStudyDetails(${
                courseOfStudy.CourseOfStudyId
              })>Details</button>
          </td>
      `;
}

const clearSearchBtn = document.getElementById("clear_search_btn");
clearSearchBtn.addEventListener("click", ()=>{
  location.reload();
})

// DETAILS OF COURSE OF SRUDY
const courseOfStudyDetails = async (id) => {
  const response = await fetch(apiEndpoint + "/" + id, {
    method: "GET"
  })

  let eachCOS = await response.json();
  let cosArray = [];
  cosArray.push(eachCOS);

  let status = "";

  cosArray.forEach((item, index)=>{

    item.Status > 0 ? status = "Active" : status = "Inactive";

    const filteredDepartment = departmentArray.find((department) => department.DepartmentId === item.DepartmentId)

    document.getElementById("courseOfStudyDepartment").innerHTML = `Course Of Study Department: ${filteredDepartment.Name}`;
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

// VALIDATION SYSTEM
const validation = (courseStudy) => {
  if (!validate.minimumInteger(courseStudy.DepartmentId, 1, "Department Id")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseStudy.Name, 3, "Course of Study Name")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseStudy.ShortName, 3, "Course of Study Short Name")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseStudy.Award, 3, "Course of Award")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minimumInteger(courseStudy.Duration, 4, "Course of Study Duration")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minimumInteger(courseStudy.RequiredCreditUnits, 20, "Course of Study Required Credit Units")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseStudy.Advisor, 3, "Course of Study Advisor")) { errorMsg.innerHTML = validate.getError(); return false;}
  if (!validate.minLength(courseStudy.UniqueId, 3, "Course of Study Unique Id")) { errorMsg.innerHTML = validate.getError(); return false }
  return true;
}