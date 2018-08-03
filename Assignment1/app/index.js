const http = require("http");
const url = require("url");
var server = http.createServer((req, res) => {
  //parsed the url
  var parsedUrl = url.parse(req.url, true);
  //trim the url if any params are there
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Handle Request if path match
  var callRoute =
    typeof routes[trimmedPath] !== "undefined"
      ? routes[trimmedPath]
      : handler.routeNotFound;
  var data = {};
  callRoute(data, function(statusCode, message) {
    statusCode = typeof statusCode == "number" ? statusCode : 404;
    message = JSON.stringify(message);
    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode);
    res.end(message);
    console.log("statusCode : " + statusCode);
  });
});

server.listen(3000, () => console.log("server is listening at 3000.."));

var handler = {};

handler.hello = function(data, callback) {
  callback(200, { welcome: "Welcome to the nodejs restful API" });
};
handler.routeNotFound = function(data, callback) {
  callback(404);
};

var routes = {
  hello: handler.hello
};
