/*
* primary file for the API
*
*/

// Dependencies
var server = require("./lib/server");
var workers = require("./lib/workers");

//Declare the app
var app = {};

app.init = function() {
  //start the servre
  server.init();

  //start the workers
  workers.init();
};

app.init();

module.exports = app;
