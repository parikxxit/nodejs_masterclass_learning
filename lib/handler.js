/*
 *
 * Theses arr the request handler
 * 
 */
//dependencies
var _data = require('./data');
var helper = require('./helper');
// define handlers 
var handlers = {};
// handlers.sample = function(data, callback) {
//     //callback http status code
//     //payload object
//     callback(406,{'name' : 'sample handler'})//sample response
// }
//not found handler
handlers.notFound = function (data, callback) {
    callback(404);
}
// Ping handlers
handlers.ping = function (data, callback) {
    callback(200);
}
//Users
handlers.users = function (data, callback) {
    var acceptableMethod = ['get', 'put', 'post', 'delete'];
    if (acceptableMethod.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405); // status code for method not allowed
    }
}
// container for user submethod
handlers._users = {};
// User post
// required data : firstname, lastname, phone, password, tosAggrement
// optional data : none
/*
    sample data
    {
	"firstname" :"pari",
	"lastname" : "singh",
	"password" : "1234",
	"phone" : "0123419789",
	"tosAggrement" : true																							
    }
*/
handlers._users.post = function (data, callback) {
    // check all required fields are there
    var firstname = typeof (data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname : false;
    var lastname = typeof (data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;
    var tosAggrement = typeof (data.payload.tosAggrement) == 'boolean' && data.payload.tosAggrement == true ? true : false;
    console.log(firstname,lastname,password,phone,password,tosAggrement)
    if (firstname && lastname && password && password && tosAggrement) {
        // make sure user donsen't exist
        _data.read('users', phone, function (err, data) {
            if (err) {
                // hash the password
                var hashedPassword = helper.hash(password);
                if (hashedPassword) {
                    // create the user object
                    var userObject = {
                        'firstname': firstname,
                        'lastname': lastname,
                        'phone': phone,
                        'hashedPassword': hashedPassword,
                        'tosAggrement': true
                    };
                    _data.create("Users", phone, userObject, function (err) {
                        if (!err) {
                            callback(200, {'Success' : 'User Created'})
                        } else { 
                            console.log(err);
                            callback(500, {
                                Error: 'Could not create new User'
                            });
                        }
                    })
                } else {
                    callback(500,{'Error' : 'Unable to hash password'});
                }
            } else {
                callback(400, {
                    'Error': 'User already esists'
                });
            }
        })
    } else {
        callback(400, 'Error : Misssing field');
    }
}
// required data phone
// optional data none
//@TODO : only let authenticat user asscess its object only
handlers._users.get = function (data, callback) {
    //check phone is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone .trim():false;
    if(phone) {
        _data.read("Users",phone,function(err,data){
            if(!err && data) {
                // removed the hashed passsword
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404, {'Error' : 'User dose not found'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing field'})
    }
}
// User put
// required data : phone 
// optional data : firstname , lastname, password (or atleast one)
//@TODO : only let authenticat user asscess its object only
handlers._users.put = function (data, callback) {
    // check all required fields are there
    var firstname = typeof (data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname : false;
    var lastname = typeof (data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password : false;
    if (firstname || lastname || password) {
        // make sure user donsen't exist
        _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
                if(firstname) {
                    userData.firstname = firstname;
                }
                if(lastname) {
                    userData.lastname = lastname;
                }
                if(password) {
                    userData.hashedPassword = helper.hash(password);
                }
                _data.update("Users",phone,userData,function(err){
                    if(!err) {
                        callback(200,{'Success' : 'User updated successfully'})
                    } else {
                        console.log(err);
                        callback(500, {'Error' : 'Error while updating data'});
                    }
                })
            }
        })
    } else {
        callback(400, 'Error : Misssing field');
    }
}
// required field phone
// optional data :none
//@TODO : only let authenticat user asscess its object only
//@TODO : delete all the user asssciation
handlers._users.delete = function (data, callback) {
    //check phone is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone .trim():false;
    if(phone) {
        _data.read("Users",phone,function(err,data){
            if(!err && data) {
                _data.delete("Users",phone,function(err){
                    if(!err) {
                        callback(200,{'Success' : 'User deleted'});
                    } else {
                        callback(500, {'Error' : 'Unable to delete user'});
                    }
                })
            } else {
                callback(400, {'Error' : 'User dose not found'})
            }
        })
    } else {
        callback(400, {'Error' : 'Missing field'})
    }
}
//export
module.exports = handlers;