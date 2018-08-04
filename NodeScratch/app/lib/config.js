/* 
create and export configuration variable

*/

//container for all the enviornments

var enviornments = {};

enviornments.staging = {
  httpport: 3000,
  httpsport: 3001,
  envName: "staging",
  hashingSecret: "thisISASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+15005550006"
  }
};

// production enviornment

enviornments.production = {
  httpport: 5000,
  httpsport: 5001,
  envName: "production",
  hashingSecret: "thisISAlsoASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACa2176c94ac09151b66feafae2e81aedd",
    authToken: "08441aeb60d406f71177915504c6132a",
    fromPhone: "+16193047923"
  }
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
