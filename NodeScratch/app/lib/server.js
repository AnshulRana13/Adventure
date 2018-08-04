/*
* primary file for the sever
*
*/

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
var handlers = require("./handlers");
var helpers = require("./helpers");
var path = require("path");
var util = require("util");
var debug = util.debuglog("server");
//Intiantiate the server

//Your new Phone Number is +16193047923
// helpers.sendTwilioSms("8884135222", "Hello!", function(err) {
//   console.log("this was the error: ", err);
// });

// Instantiate the Http Server

var server = {};

//server configuration
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// Instatiate https server

server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))
};
server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    server.unifiedServer(req, res);
  }
);

// All the server logic for both the http & https server

server.unifiedServer = function(req, res) {
  //Get the url and parse it
  var parsedUrl = url.parse(req.url, true);

  //Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  //Get the Http Method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  //Get the Payload if there is any
  var decoder = new StringDecoder("utf8");
  var buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // choose the handler this request should go to.

    var choosenHandler =
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handler.notFound;

    //construct data object to send to handler

    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    //Route the request to sepcify in the router
    choosenHandler(data, (statusCode, payload) => {
      //use the status code called by the callback used by handler , or default
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      //use the payload called back by the handler or default
      payload = typeof payload == "object" ? payload : {};

      // convert the payload to string
      var payloadString = JSON.stringify(payload);

      //return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // If the response is 200, print green, otherwise print red
      if (statusCode == 200) {
        debug(
          "\x1b[32m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m",
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      }
    });
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

  //start the server and have it listen on port 3001.
  server.httpsServer.listen(config.httpsport, () => {
    console.log(
      "\x1b[35m%s\x1b[0m",
      "The HTTPS server is running on port " + config.httpsport
    );
  });
};

//Define a request router

server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks
};

module.exports = server;
