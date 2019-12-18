/*
 * 
 * helper for various task
 * 
 */
var crypto = require("crypto");
var config = require('./config');
var helper = {};
helper.hash = function(str){
    if(typeof(str) == 'string' && str.trim().length > 0) {
        var hashString = crypto.createHmac('sha256',config.hashSecret).update(str).digest('hex');
        return hashString;
    } else {
        return false;
    }
}
//parse a json string to an object without throwing
helper.parseJSONToObject = function(payload) {
    try {
        var obj = JSON.parse(payload);
        return obj;
    } catch (error) {
        return {};
    }

}
module.exports = helper;