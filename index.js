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
 var url = require("url");
 var StringDecoder = require("string_decoder").StringDecoder // for payload
 // server should response to all the request with valid string
var server = http.createServer(function(req,res){
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
        // send the response
        res.end("Server created\n");
        // Log the request/response
        // console.log('Request received on path: '+trimmedPath + ' with method', method, 'with these query string parameters', queryStringObject);
        console.log('request recive with payload', buffer);
    })
})

 // start the server and run on port 3000
server.listen(3000, function(){
    console.log("Server is running on port 3000");
});