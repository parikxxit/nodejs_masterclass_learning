/*
 *
 * create and export config variable
 * 
 */

// ciontainer for all env var
var environment = {};

// stagin env(default)
environment.staging = {
    'port' : 3000,
    'envName' : 'Staging'
}

// production env
environment.production = {
    'port' : 5000,
    'envName' : 'Production'
}

// determine the env from cmd
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';
var envToExport = typeof(environment[currentEnv]) == 'object' ? environment[currentEnv] : environment.staging;
module.exports = envToExport;