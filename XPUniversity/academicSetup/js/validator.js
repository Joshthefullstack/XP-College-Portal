 let error = ""
 
 class validator{
    minLength(input, minValue, name){
        let inputLength = input.length
        if(inputLength < minValue){
            error = `Please input a valid ${name}`;
            return false;
        }
        return true;
    }

    minimumInteger(input, minValue, name){
        if (input < minValue) {
          error = `Please choose a valid ${name}`;
          return false;
        }
        return true
      }

      async populatePage(){
        const head = await fetch("../academicSetup/js/head.js");
        const response = await head.text();
        document.getElementById("head").innerHTML = response;
      
        const sideBar = await fetch("../academicSetup/js/sidebar.js");
        const side = await sideBar.text();
        document.getElementById("sideBar").innerHTML = side;
      
        const topBar = await fetch("../academicSetup/js/topbar.js");
        const top = await topBar.text();
        document.querySelector("#topNav").innerHTML = top;
      }

    getError(){ return error }
}
