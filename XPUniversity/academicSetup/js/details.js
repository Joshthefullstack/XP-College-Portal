const id = new URLSearchParams(window.location.search).get('id');

let template = '';
const renderEachData = async () => {
    const faculty = await fetch('http://localhost:8097/api/v1/faculties/' + id);
    const data  = await faculty.json();
    // console.log(data);

    let status = "";
    if(data.Status > 1){
        status = "Active"
    } else{
        status = "Inactive"
    }

    const container = document.querySelector('.container');;
    template += `
        <p>Faculty Name: ${data.Name}</p>
        <p>Faculty Code: ${data.Code}</p>
        <p>Faculty Unique Id: ${data.UniqueId}</p>
    `
    container.innerHTML = template;
}


window.addEventListener('DOMContentLoaded', ()=>{renderEachData()})