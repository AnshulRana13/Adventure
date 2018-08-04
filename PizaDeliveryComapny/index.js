/*
* primary file for the API
*
*/

// Dependencies

var server = require("./lib/server");
var app = {};

app.init = function() {
  //start the servre
  server.init();
};

app.init();

module.exports = app;
