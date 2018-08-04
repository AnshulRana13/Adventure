var querystring = require("querystring");
var helpers = {};
//parse a json string to all cases
helpers.parseJsonToObject = function(str) {
  try {
    var data = JSON.parse(str);
    return data;
  } catch (e) {
    return {};
  }
};

module.exports = helpers;
