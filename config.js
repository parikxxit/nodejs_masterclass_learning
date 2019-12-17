/*
 *
 * create and export config variable
 * 
 */

// ciontainer for all env var
var environment = {};

// stagin env(default)
environment.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'Staging'
}

// production env
environment.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'Production'
}

// determine the env from cmd
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';
var envToExport = typeof(environment[currentEnv]) == 'object' ? environment[currentEnv] : environment.staging;
module.exports = envToExport;