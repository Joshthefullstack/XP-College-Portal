let errorMsg = "";

class Validator {
  
  isBodyValid(body) {
    if (body == null) {
      errorMsg = "Invalid request parameters";
      return false;
    }
    return true;
  }

  minlength(input, minValue, name) {
    let inputLength = input.length;

    if (inputLength < minValue) {
      errorMsg += `${name} must be minimum of ${minValue} characters`;
      return false;
    }
    return true
  }

  minimumInteger(input, minValue, name){
    if (input < minValue) {
      errorMsg = `${name} must be minimum of ${minValue} characters`;
      return false;
    }
    return true
  }

  getError() { return errorMsg; }

}

module.exports = {
  Validator
}