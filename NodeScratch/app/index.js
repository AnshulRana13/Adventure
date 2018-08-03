/*
* primary file for the API
*
*/

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

// Instantiate the Http Server
var httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// start the server and have it listen on port 3000.
httpServer.listen(config.httpport, () => {
  console.log(
    "The server is listening on port at " +
      config.httpport +
      " in " +
      config.envName
  );
});

// Instatiate https server

var httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};
var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// start the server and have it listen on port 3001.
httpsServer.listen(config.httpsport, () => {
  console.log(
    "The server is listening on port at " +
      config.httpsport +
      " in " +
      config.envName
  );
});

// All the server logic for both the http & https server

var unifiedServer = function(req, res) {
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
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handler.notFound;

    //construct data object to send to handler

    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer
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

      //log the request
      console.log("Returnin the response: ", statusCode, payloadString);
    });
  });
};

// define handlers

var handler = {};

handler.ping = function(data, callback) {
  // callback a http status code, and a payload object
  callback(200, { name: "sample handler" });
};

handler.notFound = function(data, callback) {
  callback(404);
};

//Define a request router

var router = {
  ping: handler.ping
};
