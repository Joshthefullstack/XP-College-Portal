const express = require('express');
const bodyparser = require("body-parser");
var cors = require("cors")
const app = express();

async function init() {
  app.use(bodyparser.json({ limit: "50mb" }));
  app.use(cors());
  app.use(
    bodyparser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000
    })
  );
  const app_route = require("./modules/module");
  const app_modules = new app_route(app);
  app.get("/", (req, res) => {
    res.send("Welcome to Academics API");
  });
  app_modules.init();
}

init();
module.exports = app;

