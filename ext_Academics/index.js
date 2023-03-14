var app = require("./app");

var port = process.env.PORT || 8097;
app.listen(port);
console.log("Academics API is running at " + port);