/*
 * Request Handlers
 *
 */

// Dependencies

//Container for handler
var handlers = {};

// Not-Found
handlers.notFound = function(data, callback) {
  callback(404);
};

handlers.users = function(data, callback) {
  //Acceptable verbs
  var acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users = {};

//post request
handlers._users.post = function(data, callback) {};

//get request
handlers._users.get = function(data, callback) {};

//put request
handlers._users.put = function(data, callback) {};

//delete request
handlers._users.delete = function(data, callback) {};

module.exports = handlers;
