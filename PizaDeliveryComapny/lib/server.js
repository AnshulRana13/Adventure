/*
* primary file for the sever
*
*/

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var handlers = require("./handlers");
var helpers = require("./helpers");

// Instantiate the Http Server

var server = {};

server.httpServer = http.createServer((req, res) => {});

server.unifiedServer = function(req, res) {
  //Get the url and parse it
  var parsedUrl = url.parse(req.url, true);

  //Get the path of the url
  var path = parsedUrl.pathname;

  //trimmed the path
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get the query string as a object
  var queryStingObject = parsedUrl.query;

  //Get the http method name
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  //Get the payload if any
  var decoder = new StringDecoder("utf8");
  var buffer = "";

  //Reading the payload from req and converting it utf-8 and appending it with buffer;
  req.on("data", (err, data) => {
    if (!err && data) {
      buffer += decoder.write(data);
    }
  });

  //on req end firing an event stopt the decoder and forming structure payload
  req.on("end", (err, data) => {
    //ending the decoder
    buffer += decoder.end();
  });

  //choose the respective handler for the user
  var chosenHandler =
    typeof server.routes[trimmedPath] !== "undefined"
      ? server.routes[trimmedPath]
      : handler.notFound;

  //construct data object whc=ich we need to pass to the handler
  var data = {
    trimmedPath: trimmedPath,
    queryStringObject: queryStringObject,
    method: method,
    headers: headers,
    payload: helpers.parseJsonToObject(buffer)
  };

  //Route the request to sepcify in the router
  chosenHandler(data, (statusCode, payload) => {
    //use the status code called by the callback used by handler , or default
    statusCode = typeof statusCode == "number" ? statusCode : 200;

    //use the payload called back by the handler or default
    payload = typeof payload == "object" ? payload : {};

    // convert the payload to string
    var payloadString = JSON.stringify(payload);

    // If the response is 200, print green, otherwise print red
    if (statusCode == 200) {
      console.log(
        "\x1b[32m%s\x1b[0m",
        method.toUpperCase() + " /" + trimmedPath + " " + statusCode
      );
    } else {
      console.log(
        "\x1b[31m%s\x1b[0m",
        method.toUpperCase() + " /" + trimmedPath + " " + statusCode
      );
    }
  });
};

// server init function

server.init = function() {
  //Start the server
  // start the server and have it listen on port 3000.
  server.httpServer.listen(config.httpport, () => {
    console.log(
      "\x1b[36m%s\x1b[0m",
      "The HTTP server is running on port " + config.httpport
    );
  });
};
//setting up the routing

server.routes = {
  users: handlers.users
};

module.exports = server;
