/* 
create and export configuration variable

*/

//container for all the enviornments

var enviornments = {};

enviornments.staging = {
  httpport: 3000,
  httpsport: 3001,
  envName: "staging"
};

// production enviornment

enviornments.production = {
  httpport: 5000,
  httpsport: 5001,
  envName: "production"
};

//Determin which env passed via command line argument

var currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

//check weather current env is one of the mentioned env, or default to staging

var envToExport =
  typeof enviornments[currentEnv] == "object"
    ? enviornments[currentEnv]
    : enviornments.staging;

//export the module

module.exports = envToExport;
