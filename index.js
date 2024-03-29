/*
 * Primary file api
 *
 */ 
/*
 * @Learn : read about req.on
 * 
 */
 // Dependencies
 var http = require("http");
 var https = require("https"); // https server
 var fs = require("fs"); // to read https file
 var url = require("url");
 var StringDecoder = require("string_decoder").StringDecoder // for payload
 var config = require('./lib/config');
 var _data = require('./lib/data');
 var handlers = require('./lib/handler');
 var helper = require('./lib/helper');
 // Instantiate http server
var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});

 // start the server and run on port 3000
httpServer.listen(config.httpPort, function(){
    console.log("Server is running on port",config.httpPort,"on", config.envName,"mode");
});
var httpsServerOption = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pe')
};
// instantiate the https server
var httpsServer = https.createServer(httpsServerOption, function(req,res){
    unifiedServer(req,res);
})
// start the https server
httpsServer.listen(config.httpsPort, function(){
    console.log("Server is running on port",config.httpsPort,"on", config.envName,"mode");
});
// All the server logic for http and https server
var unifiedServer = function(req,res) {
    // get the url and parse it
    var parsedUrl = url.parse(req.url, true); 
    // get the path
    var path = parsedUrl.pathname;
    // console.log("path is " ,parsedUrl.path); this also can be used insted of trimmedPath
    var trimmedPath = path.replace(/^\/+|\/+$/g, ''); 
    
    // get the query string as an object
    var queryStringObject = parsedUrl.query;
    
    // get the http method
    var method = req.method.toLowerCase();
    
    // get the headers as an object
    var headers = req.headers;
    
    // get the payload is any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    })
    req.on('end', function(){
        buffer += decoder.end();

        // chose the handler where it  goes to
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?router[trimmedPath] : handlers.notFound;
        // cunstruct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helper.parseJSONToObject(buffer)
        }
        // route the request to the handler
        chosenHandler(data,function(statusCode, payload){
            // Use the status code callback by the handler or defauld 200
            // User the payload by the handler or empty object
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};
            // convert the payload into string
            payloadString = JSON.stringify(payload);
            // return the response
            // send the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            // Log the request/response
            // console.log('Request received on path: '+trimmedPath + ' with method', method, 'with these query string parameters', queryStringObject);
            console.log('returned response is ', statusCode, payloadString);
        });
        
    });
}

// define a request router
var router = {
    // 'sample' : handlers.sample,
    'ping' : handlers.ping,
    'users' : handlers.users
}
