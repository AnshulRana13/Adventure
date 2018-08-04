/*
 File system for storing and editing data
*/

//Dependencies
var fs = require("fs");
var path = require("path");
var helpers = require("./helpers");

//Conatiner for the module to export

var lib = {};

//base url
lib.baseDir = path.join(__dirname, "/../.data/");

// Create file and write data
lib.create = function(dir, fileName, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + fileName + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        var stringData = JSON.stringify(data);

        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback("error in closing file");
              }
            });
          } else {
            callback("error in writing the file");
          }
        });
      } else {
        callback("Could not create a file , It may be exist");
      }
    }
  );
};
// read file
lib.read = function(dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", (err, data) => {
    if (!err && data) {
      var parseData = helpers.parseJsonToObject(data);
      callback(false, parseData);
    } else {
      callback(err, data);
    }
  });
};
// update file
lib.update = function(dir, fileName, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + fileName + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        var stringData = JSON.stringify(data);

        //Truncate the file

        fs.truncate(fileDescriptor, err => {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, err => {
              if (!err) {
                fs.close(fileDescriptor, err => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("error in closing the file");
                  }
                });
              } else {
                callback("Error in writing the file");
              }
            });
          } else {
            callback("error in truncate file");
          }
        });
      } else {
        callback("Could not oprn the file for updating, it may not exist yet");
      }
    }
  );
};
// delete file
lib.delete = function(dir, fileName, callback) {
  //unlinking file from file system

  fs.unlink(lib.baseDir + dir + "/" + fileName + ".json", err => {
    if (!err) {
      callback(false);
    } else {
      callback("Error in deleting the file");
    }
  });
};

//list all the items in a direcotries

lib.list = function(dir, callback) {
  fs.readdir(lib.baseDir + dir + "/", function(err, data) {
    if (!err && data && data.length > 0) {
      var trimmedFileName = [];
      data.forEach(element => {
        trimmedFileName.push(element.replace(".json", ""));
      });
      callback(false, trimmedFileName);
    } else {
      callback(err, data);
    }
  });
};
module.exports = lib;
